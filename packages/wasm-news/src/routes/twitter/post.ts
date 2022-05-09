import Boom from '@hapi/boom'
import type Hapi from '@hapi/hapi'
import makeDebug from 'debug'
import type { GoogleSpreadsheet } from 'google-spreadsheet'
import Joi from 'joi'
import { TwitterApi } from 'twitter-api-v2'
import type { TwitterApiReadOnly, TweetV2, UserV2 } from 'twitter-api-v2'

const debug = makeDebug('wasm-news/twitter')

interface TweetsByUsername {
  client: TwitterApiReadOnly
  username: string
}

const tweetsByUsername = async ({ client, username }: TweetsByUsername) => {
  const result = await client.v2.userByUsername(username, {
    'user.fields': ['description', 'location', 'public_metrics']
  })

  if (result.errors) {
    return { error: result.errors[0].detail }
  }

  const user = result.data

  // https://github.com/PLhery/node-twitter-api-v2/blob/4e768343bcd0ae468aac4cd0fbba53082df86694/doc/v2.md#user-timeline
  // https://github.com/PLhery/node-twitter-api-v2/blob/4e768343bcd0ae468aac4cd0fbba53082df86694/doc/paginators.md
  const paginator = (await client.v2.userTimeline(user.id, {
    exclude: 'replies',
    expansions: ['author_id'],
    'tweet.fields': ['author_id', 'created_at', 'id', 'source', 'text']
  })) as any

  //   console.log(
  //     'paginator.rateLimit',
  //     paginator.rateLimit,
  //     'paginator.done',
  //     paginator.done,
  //     'paginator.meta',
  //     paginator.meta
  //   )

  const value = { username, tweets: [] as TweetV2[] }

  for (const tweet of paginator) {
    value.tweets.push(tweet)
  }

  return { value }
}

interface TweetMap {
  username: string
  tweets: TweetV2[]
}

interface Entry {
  creation_date?: string
  id: string
  tweet: string
  url?: string
  username: string
}

const toEntry = (entry: [string, string | TweetV2[]]): Entry[] => {
  const username = entry[0]
  const tweets = entry[1] as TweetV2[]

  return tweets.map(({ author_id, created_at, id, text }) => {
    const creation_date = created_at ? created_at.slice(0, 10) : undefined

    const url = author_id
      ? `https://twitter.com/${author_id}/status/${id}`
      : undefined

    return {
      creation_date,
      id,
      tweet: text,
      url,
      username
    }
  })
}

const entriesFromUsers = async (
  client: TwitterApiReadOnly
): Promise<Entry[]> => {
  const promises = DEFAULT_USERNAMES.map(async (username) => {
    try {
      const { error, value } = await tweetsByUsername({
        client,
        username
      })
      return { error, value }
    } catch (err: any) {
      return { error: err.message }
    }
  })

  const objects = await Promise.all(promises)

  const tweet_map = objects
    .filter((obj) => obj.value)
    .map((obj) => obj.value!)
    .reduce((acc, cv) => {
      return { ...acc, [cv.username]: cv.tweets }
    }, {} as TweetMap)

  const entries = Object.entries(tweet_map).flatMap(toEntry)

  return entries
}

const entriesFromSearch = async (
  client: TwitterApiReadOnly
): Promise<Entry[]> => {
  // https://github.com/PLhery/node-twitter-api-v2/blob/4e768343bcd0ae468aac4cd0fbba53082df86694/doc/v2.md#Searchtweetsrecent
  const query = '(wasmtime OR emscripten) -is:retweet lang:en'
  const paginator = (await client.v2.search(query, {
    expansions: ['author_id'],
    'tweet.fields': ['author_id', 'created_at', 'id', 'source', 'text'],
    'user.fields': ['id', 'username']
  })) as any

  const users_map: { [user_id: string]: UserV2 } = {}
  const users = paginator.includes.users
  if (users) {
    for (let i = 0; i < users.length; i++) {
      users_map[users[i].id] = users[i]
    }
  }

  const tweets: TweetV2[] = []
  for (const tweet of paginator) {
    tweets.push(tweet)
  }

  const entries = tweets.map(({ author_id, created_at, id, source, text }) => {
    const creation_date = created_at ? created_at.slice(0, 10) : undefined

    const url = author_id
      ? `https://twitter.com/${author_id}/status/${id}`
      : undefined

    const username = author_id ? users_map[author_id].username : ''

    return {
      creation_date,
      id,
      source,
      tweet: text,
      url,
      username
    }
  })

  return entries
}

export interface Config {
  doc: GoogleSpreadsheet
  twitter_oauth_token: string
}

// const DEFAULT = {
//   N_DAYS: 7
// }

// Twitter accounts that talk often about WebAssembly
const DEFAULT_USERNAMES = ['ColinEberhardt', 'kripken', 'kubkon', 'WasmWeekly']

const response_schema = Joi.object({
  message: Joi.string().min(3).required(),
  rows_inserted: Joi.number().min(0).required()
})

export const twitterPost = ({ doc, twitter_oauth_token }: Config) => {
  const sheet = doc.sheetsByTitle['twitter']
  debug(`sheet ${sheet.title} (cell stats %O)`, sheet.cellStats)

  const twitterClient = new TwitterApi(twitter_oauth_token)
  debug(`initialized Twitter client`)

  return {
    method: 'POST',
    path: '/twitter',
    options: {
      response: {
        status: {
          200: response_schema.required()
        },
        // eslint-disable-next-line @typescript-eslint/prefer-as-const
        failAction: 'error' as 'error'
      },
      validate: {
        // eslint-disable-next-line @typescript-eslint/prefer-as-const
        failAction: 'error' as 'error',
        payload: Joi.object({
          n_days: Joi.number().min(1).max(365)
        }),
        query: false
      }
    },
    handler: async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
      if (!request.payload) {
        throw Boom.badRequest()
      }

      //   const payload = request.payload as any
      const roClient = twitterClient.readOnly

      // TODO: error handling

      const entries_from_users = await entriesFromUsers(roClient)

      const entries_from_search = await entriesFromSearch(roClient)

      const entries = [...entries_from_users, ...entries_from_search]

      // remove duplicates, if any
      const unique = entries.reduce((acc, cv) => {
        const seen_tweets = acc.filter((entry) => entry.id === cv.id)
        if (seen_tweets.length > 0) {
          return acc
        } else {
          return [...acc, cv]
        }
      }, [] as Entry[])

      let message = ''
      let rows_inserted = 0
      try {
        await sheet.addRows(unique as any)
        message = `inserted ${unique.length} rows in spreadsheet [${doc.title}], worksheet [${sheet.title}]`
        rows_inserted = unique.length
        debug(message)
      } catch (err: any) {
        message = `could not insert rows in spreadsheet [${doc.title}], worksheet [${sheet.title}]: ${err.message}`
        debug(message)
      }

      return {
        message,
        rows_inserted
      }
    }
  }
}
