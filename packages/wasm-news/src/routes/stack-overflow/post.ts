import makeDebug from 'debug'
import type Hapi from '@hapi/hapi'
import Joi from 'joi'
import axios from 'axios'
import { nowAndPastUTC } from '@jackdbd/utils/dates'
import type { Question } from '@userscripters/stackexchange-api-types'
import type { GoogleSpreadsheet } from 'google-spreadsheet'

const debug = makeDebug('wasm-news/stack-overflow')

// https://stackapps.com/questions/9162/stack-exchange-api-types-a-type-declaration-package-for-api-types
const API = 'https://api.stackexchange.com/2.2'

interface ResponseBodySearch {
  has_more: boolean
  items: Question[]
  quota_max: number
  quota_remaining: number
}

interface Summary {
  answered: boolean
  answers: number
  creation_date: string
  id: number
  score: number
  tags: string
  title: string
  url: string
  views: number
}

const summaryFromQuestion = ({
  answer_count,
  creation_date,
  is_answered,
  link,
  question_id,
  score,
  tags,
  title,
  view_count
}: Question): Summary => {
  return {
    answered: is_answered,
    answers: answer_count,
    creation_date: new Date(creation_date * 1000).toISOString().slice(0, 10),
    id: question_id,
    score,
    tags: tags.join(', '),
    title,
    url: link,
    views: view_count
  }
}

interface SearchConfig {
  fromdate: number
  page: number
  pagesize: number
  tagged: string
  todate: number
}

const search = async ({
  fromdate,
  page,
  pagesize,
  tagged,
  todate
}: SearchConfig) => {
  const order = 'desc'
  const site = `stackoverflow`
  const sort = 'activity'

  const search_query = [
    `fromdate=${fromdate}`,
    `todate=${todate}`,
    `site=${site}`,
    `tagged=${tagged}`,
    `order=${order}`,
    `page=${page}`,
    `pagesize=${pagesize}`,
    `sort=${sort}`
  ]

  const search_qs = search_query.join('&')

  const { data } = await axios.get<ResponseBodySearch>(
    `${API}/search?${search_qs}`
  )
  const { has_more, items } = data
  debug(`found ${items.length} items at page ${page}. Has more? ${has_more}`)
  const summaries = items.map(summaryFromQuestion)
  return { has_more, summaries }
}

export interface Config {
  doc: GoogleSpreadsheet
}

const DEFAULT = {
  N_DAYS: 7,
  TAGS: [
    'emscripten',
    'rust-wasm',
    'wasi',
    'wasmer',
    'wasmtime',
    'wasm-pack',
    'webassemblywasm-bindgen'
  ]
}

const response_schema = Joi.object({
  message: Joi.string().min(3).required(),
  rows_inserted: Joi.number().min(0).required()
})

export const stackOverflowPost = ({ doc }: Config) => {
  const sheet = doc.sheetsByTitle['stack_overflow']
  debug(`sheet ${sheet.title} (cell stats %O)`, sheet.cellStats)

  return {
    method: 'POST',
    path: '/stack-overflow',
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
      const payload = request.payload as any

      const n_days = payload.n_days
        ? (payload.n_days as number)
        : DEFAULT.N_DAYS

      const { past, now } = nowAndPastUTC(n_days)
      const fromdate = Math.floor(new Date(past).getTime() / 1000.0)
      const todate = Math.floor(new Date(now).getTime() / 1000.0)

      const tags = payload.tags ? (payload.tags as string[]) : DEFAULT.TAGS
      const tagged = tags.join(';')

      const pagesize = 5

      let page = 1
      let has_more = true
      const summaries: Summary[] = []
      while (has_more) {
        try {
          const response = await search({
            page,
            pagesize,
            fromdate,
            todate,
            tagged
          })
          // eslint-disable-next-line prefer-spread
          summaries.push.apply(summaries, response.summaries)
          has_more = response.has_more
          page++
          const page_info = has_more
            ? `next page ${page}`
            : 'this was last page'
          request.log(['stack-overflow', 'debug'], {
            message: `${summaries.length} fetched ${page_info}`
          })
        } catch (err: any) {
          request.log(['stack-overflow', 'warning'], {
            message: `could not fetch page ${page}. Exit loop: ${err.message}`
          })
          break
        }
      }

      request.log(['stack-overflow', 'debug'], {
        message: `${summaries.length} questions tagged ${tagged}`
      })

      let message = ''
      let rows_inserted = 0
      try {
        await sheet.addRows(summaries as any)
        message = `inserted ${summaries.length} rows in spreadsheet [${doc.title}], worksheet [${sheet.title}]`
        rows_inserted = summaries.length
        request.log(['stack-overflow', 'debug'], { message })
      } catch (err: any) {
        message = `could not insert rows in spreadsheet [${doc.title}], worksheet [${sheet.title}]: ${err.message}`
        request.log(['stack-overflow', 'warning'], { message })
      }

      return {
        message,
        rows_inserted
      }
    }
  }
}
