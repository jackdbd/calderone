import Boom from '@hapi/boom'
import type Hapi from '@hapi/hapi'
import { nowAndPastUTC } from '@jackdbd/utils/dates'
import { Octokit } from '@octokit/rest'
import makeDebug from 'debug'
import type { GoogleSpreadsheet } from 'google-spreadsheet'
import Joi from 'joi'

const debug = makeDebug('wasm-news/github')

interface Summary {
  created_on?: string
  description: string
  forks: number
  full_name: string
  homepage: string
  id: number
  language: string
  license: string
  open_issues: number
  pushed_at?: string
  topics: string
  updated_on?: string
  url: string
  watchers: number
}

const summaryFromItem = (item: any): Summary => {
  let topics = ''
  try {
    topics = item.topics.join(',')
  } catch (err: any) {
    if (typeof item.topics === 'string') {
      topics = item.topics
    } else {
      debug(`cannot retrieve topics for item %O ${err.message}`, item)
    }
  }

  return {
    created_on: item.created_at ? item.created_at.slice(0, 10) : undefined,
    description: item.description,
    forks: item.forks,
    full_name: item.full_name,
    homepage: item.homepage,
    id: item.id,
    language: item.language,
    license: item.license ? item.license.name : undefined,
    open_issues: item.open_issues,
    pushed_at: item.pushed_at ? item.pushed_at.slice(0, 10) : undefined,
    topics,
    updated_on: item.updated_at ? item.updated_at.slice(0, 10) : undefined,
    url: item.html_url,
    watchers: item.watchers
  }
}

interface SearchReposConfig {
  octokit: Octokit
  date_start: string
  topic: string
}

const summaries = async ({ date_start, octokit, topic }: SearchReposConfig) => {
  const q = `topic:${topic} pushed:>${date_start}`

  const { data } = await octokit.rest.search.repos({
    q,
    sort: 'stars',
    order: 'desc'
  })
  debug(
    `${data.total_count} code pushes for topic [${topic}] since [${date_start}]`
  )
  return data.items.map(summaryFromItem)
}

export interface Config {
  doc: GoogleSpreadsheet
}

const DEFAULT = {
  N_DAYS: 7,
  TOPICS: [
    'binaryen',
    'emscripten',
    'lucet',
    'wabt',
    'wasi',
    'wasmer',
    'wasmtime',
    'webassembly'
  ]
}

const response_schema = Joi.object({
  message: Joi.string().min(3).required(),
  failed_github_topic_searches: Joi.number().min(0).required(),
  successfull_github_topic_searches: Joi.number().min(0).required(),
  total_github_topic_searches: Joi.number().min(0).required(),
  rows_inserted: Joi.number().min(0).required()
})

interface GetResultConfig {
  date_start: string
  octokit: Octokit
  topics: string[]
}

const getResults = async ({ date_start, octokit, topics }: GetResultConfig) => {
  debug(
    `search criteria: code pushes made since [${date_start}], topics %O`,
    topics
  )
  // Promise.allSettled never rejects
  return await Promise.allSettled(
    topics.map(async (topic) => {
      debug(`try searching topic [${topic}]`, topic)
      try {
        const topic_summaries = await summaries({ date_start, octokit, topic })
        debug(
          `retrieved ${topic_summaries.length} summaries from topic [${topic}]`
        )
        return topic_summaries
      } catch (err: any) {
        throw new Error(err.message)
      }
    })
  )
}

export const githubPost = ({ doc }: Config) => {
  const sheet = doc.sheetsByTitle['github']
  debug(`sheet ${sheet.title} (cell stats %O)`, sheet.cellStats)

  const octokit = new Octokit()
  debug(`initialized Github Octokit client`)

  return {
    method: 'POST',
    path: '/github',
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

      const payload = request.payload as any

      const n_days = payload.n_days
        ? (payload.n_days as number)
        : DEFAULT.N_DAYS

      const { past } = nowAndPastUTC(n_days)
      const date_start = past.slice(0, 10)

      const topics = payload.topics
        ? (payload.topics as string[])
        : DEFAULT.TOPICS

      // Promise.allSettled never rejects
      const results = await getResults({
        octokit,
        date_start,
        topics
      })

      let successfull_github_topic_searches = 0
      let failed_github_topic_searches = 0
      const entries: Summary[] = []

      for (const result of results) {
        if (result.status === 'fulfilled') {
          entries.push(...result.value.map(summaryFromItem))
          successfull_github_topic_searches++
        } else {
          request.log(['github', 'warning'], { message: result.reason.message })
          failed_github_topic_searches++
        }
      }

      const unique = entries.reduce((acc, cv) => {
        const seen = acc.filter((entry) => entry.id === cv.id)
        if (seen.length > 0) {
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
        request.log(['github', 'debug'], { message })
      } catch (err: any) {
        message = `could not insert rows in spreadsheet [${doc.title}], worksheet [${sheet.title}]: ${err.message}`
        request.log(['github', 'warning'], { message })
      }

      return {
        message,
        failed_github_topic_searches,
        successfull_github_topic_searches,
        total_github_topic_searches:
          successfull_github_topic_searches + failed_github_topic_searches,
        rows_inserted
      }
    }
  }
}
