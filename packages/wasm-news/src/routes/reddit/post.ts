import Boom from '@hapi/boom'
import type Hapi from '@hapi/hapi'
import makeDebug from 'debug'
import type { GoogleSpreadsheet } from 'google-spreadsheet'
import Joi from 'joi'
import snoowrap from 'snoowrap'
import type { BaseSearchOptions } from 'snoowrap'
import type Snoowrap from 'snoowrap'

const debug = makeDebug('wasm-news/reddit')

interface Summary {
  author: string
  creation_date: string
  id: string
  comments: number
  score: number
  text: string
  title: string
  upvote_ratio: number
  url: string
}

const toSummary = (item: any): Summary => {
  const {
    created_utc,
    id,
    name,
    num_comments,
    score,
    selftext,
    title,
    upvote_ratio,
    url
  } = item
  return {
    author: name,
    creation_date: new Date(created_utc * 1000).toISOString().slice(0, 10),
    id,
    comments: num_comments,
    score,
    text: selftext,
    title,
    upvote_ratio,
    url
  }
}

interface SubredditSearch {
  displayName: string
  search: BaseSearchOptions
}

export interface Config {
  reddit_oauth_client_id: string
  reddit_oauth_client_secret: string
  reddit_username: string
  reddit_password: string
  doc: GoogleSpreadsheet
  user_agent: string
}

// const DEFAULT_SEARCH_TIME = 'day'
const DEFAULT_SEARCH_TIME = 'week'
// const DEFAULT_SEARCH_TIME = 'month'

const DEFAULT_SUBREDDIT_SEARCHES: SubredditSearch[] = [
  {
    displayName: 'WebAssembly',
    search: { query: 'wasi', time: DEFAULT_SEARCH_TIME, sort: 'comments' }
  },
  {
    displayName: 'WebAssembly',
    search: { query: 'wasmtime', time: DEFAULT_SEARCH_TIME, sort: 'comments' }
  },
  {
    displayName: 'WebAssembly',
    search: { query: 'rust', time: DEFAULT_SEARCH_TIME, sort: 'comments' }
  },
  {
    displayName: 'WebAssembly',
    search: { query: 'zig', time: DEFAULT_SEARCH_TIME, sort: 'comments' }
  }
]

const search_schema = Joi.object({
  query: Joi.string().min(1).max(140).required(),
  time: Joi.string().valid('hour', 'day', 'week', 'month', 'year', 'all'),
  sort: Joi.string().valid('comments', 'hot', 'new', 'top', 'relevance')
})

const subreddit_search_schema = Joi.object({
  displayName: Joi.string().min(1).max(140).required(),
  search: search_schema.required()
})

const subreddit_searches_schema = Joi.array().items(subreddit_search_schema)

const response_schema = Joi.object({
  message: Joi.string().min(3).required(),
  failed_subreddit_searches: Joi.number().min(0).required(),
  successfull_subreddit_searches: Joi.number().min(0).required(),
  total_subreddit_searches: Joi.number().min(0).required(),
  rows_inserted: Joi.number().min(0).required()
})

const getResults = async (
  reddit: Snoowrap,
  subreddit_searches: SubredditSearch[]
) => {
  // Promise.allSettled never rejects
  return await Promise.allSettled(
    subreddit_searches.map(async (s) => {
      debug(
        `try searching posts in subreddit [${s.displayName}] that match search criteria %O`,
        s.search
      )
      try {
        const submissions = await reddit
          .getSubreddit(s.displayName)
          .search(s.search)
        debug(
          `retrieved ${submissions.length} submissions in subreddit [${s.displayName}] that match search criteria %O`,
          s.search
        )
        return submissions
      } catch (err: any) {
        const error_message = (err.message as string).includes('not found')
          ? `subreddit ${s.displayName} does not exist`
          : 'unknown error from snoowrap'

        throw new Error(error_message)
      }
    })
  )
}

export const redditPost = ({
  doc,
  reddit_oauth_client_id,
  reddit_oauth_client_secret,
  reddit_password,
  reddit_username,
  user_agent
}: Config) => {
  const sheet = doc.sheetsByTitle['reddit']
  debug(`sheet ${sheet.title} (cell stats %O)`, sheet.cellStats)

  // https://www.reddit.com/prefs/apps
  // https://not-an-aardvark.github.io/snoowrap/
  // https://github.com/not-an-aardvark/reddit-oauth-helper
  const reddit = new snoowrap({
    userAgent: user_agent,
    clientId: reddit_oauth_client_id,
    clientSecret: reddit_oauth_client_secret,
    username: reddit_username,
    password: reddit_password
  })

  return {
    method: 'POST',
    path: '/reddit',
    options: {
      response: {
        status: {
          200: response_schema.required()
        },
        // https://hapi.dev/tutorials/validation?lang=en_US#failaction
        // eslint-disable-next-line @typescript-eslint/prefer-as-const
        failAction: 'error' as 'error'
      },
      validate: {
        // https://hapi.dev/api?v=20.2.0#-routeoptionsvalidatefailaction
        // eslint-disable-next-line @typescript-eslint/prefer-as-const
        failAction: 'error' as 'error',
        payload: Joi.object({
          subreddit_searches: subreddit_searches_schema
        }),
        // https://hapi.dev/api?v=20.2.0#-routeoptionsvalidatequery
        query: false
      }
    },
    handler: async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
      if (!request.payload) {
        throw Boom.badRequest()
      }

      const payload = request.payload as any

      const subreddit_searches = payload.subreddit_searches
        ? (payload.subreddit_searches as SubredditSearch[])
        : DEFAULT_SUBREDDIT_SEARCHES

      // Promise.allSettled never rejects
      const results = await getResults(reddit, subreddit_searches)

      let successfull_subreddit_searches = 0
      let failed_subreddit_searches = 0
      const summaries: Summary[] = []

      for (const result of results) {
        if (result.status === 'fulfilled') {
          summaries.push(...result.value.map(toSummary))
          successfull_subreddit_searches++
        } else {
          request.log(['reddit', 'warning'], { message: result.reason.message })
          failed_subreddit_searches++
        }
      }

      const unique = summaries.reduce((acc, cv) => {
        const seen_reddit_posts = acc.filter((entry) => entry.id === cv.id)
        if (seen_reddit_posts.length > 0) {
          return acc
        } else {
          return [...acc, cv]
        }
      }, [] as Summary[])

      let message = ''
      let rows_inserted = 0
      try {
        await sheet.addRows(unique as any)
        message = `inserted ${unique.length} rows in spreadsheet [${doc.title}], worksheet [${sheet.title}]`
        rows_inserted = unique.length
        request.log(['reddit', 'debug'], { message })
      } catch (err: any) {
        message = `could not insert rows in spreadsheet [${doc.title}], worksheet [${sheet.title}]: ${err.message}`
        request.log(['reddit', 'warning'], { message })
      }

      return {
        message,
        failed_subreddit_searches,
        successfull_subreddit_searches,
        total_subreddit_searches:
          successfull_subreddit_searches + failed_subreddit_searches,
        rows_inserted
      }
    }
  }
}
