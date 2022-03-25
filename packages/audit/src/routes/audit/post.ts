import type { ExecutionsClient } from '@google-cloud/workflows'
import Boom from '@hapi/boom'
import type Hapi from '@hapi/hapi'
import { send as sendTelegramMessage } from '@jackdbd/notifications/telegram'
import { operationListText } from '@jackdbd/telegram-text-messages'
import type {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow
} from 'google-spreadsheet'

const cellValueToBoolean = (s: string) => {
  return s.toUpperCase() === 'TRUE' ? true : false
}

interface Config {
  cloud_run_logs_href: string
  doc: GoogleSpreadsheet
  service_name: string
  service_version: string
  telegram_chat_id: string
  telegram_token: string
  workflow_executions: ExecutionsClient
  workflow_path: string
}

interface Result {
  n_audits: number
  n_executions_created: number
  n_executions_errored: number
  urls_retrieved_from_sheet: number
  workflow_revision_id?: string
}

const rowToConfig = (row: GoogleSpreadsheetRow) => {
  return {
    location: row.location as string,
    record_chrome_performance_trace: cellValueToBoolean(
      row.record_chrome_performance_trace
    ),
    record_devtools_timeline: cellValueToBoolean(row.record_devtools_timeline),
    record_filmstrip: cellValueToBoolean(row.record_filmstrip),
    runs: row.runs as number
  }
}

const DEFAULT = {
  limit: 10
}

export const auditPost = ({
  cloud_run_logs_href,
  doc,
  service_name,
  service_version,
  telegram_chat_id,
  telegram_token,
  workflow_executions,
  workflow_path
}: Config) => {
  //   console.log('doc.defaultFormat', doc.defaultFormat)
  //   console.log('doc.spreadsheetTheme', doc.spreadsheetTheme)
  const queue_sheet = doc.sheetsByTitle['queue']
  const wpt_config_sheet = doc.sheetsByTitle['wpt_config']

  return {
    method: 'POST',
    path: '/audit',
    handler: async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
      if (!request.payload) {
        throw Boom.badRequest()
      }

      const payload = request.payload as any

      if (payload.limit && payload.limit <= 0) {
        throw Boom.badRequest()
      }

      const limit = payload.limit || DEFAULT.limit

      const audit_rows = await queue_sheet.getRows({ limit, offset: 0 })

      const config_rows = await wpt_config_sheet.getRows({
        limit: 50,
        offset: 0
      })

      request.log(['audit', 'debug'], {
        message: `Google Sheet containing WebPageTest queue and config [${doc.title}]`
      })

      const result: Result = {
        n_audits: 0,
        n_executions_created: 0,
        n_executions_errored: 0,
        urls_retrieved_from_sheet: audit_rows.length
      }

      const successes: string[] = []
      const failures: string[] = []
      const warnings: string[] = []

      for (const row of audit_rows) {
        if (!row.url) {
          try {
            const message = `delete row[${row.rowIndex}] ${row.a1Range} (empty row)`
            request.log(['audit', 'warning'], { message })
            await row.delete()
            continue
          } catch (err: any) {
            const message = `failed to delete row[${row.rowIndex}] ${row.a1Range}: ${err.message}`
            request.log(['audit', 'warning'], { message })
          }
        }

        const configs = config_rows.map(rowToConfig)

        for (const config of configs) {
          const obj = { url: row.url, label: row.label || '', ...config }
          const argument = JSON.stringify(obj)
          const message = `audits[${result.n_audits}] URL [${row.url}] @ [${config.location}] (${config.runs} run/s)`
          request.log(['audit', 'debug'], { message })
          successes.push(message)
          result.n_audits++

          try {
            const [resp] = await workflow_executions.createExecution({
              execution: { argument },
              parent: workflow_path
            })
            const message = `executions[${result.n_executions_created}] [${resp.name}]`
            successes.push(message)
            request.log(['audit', 'debug'], { message })
            result.n_executions_created++
            if (resp.workflowRevisionId) {
              result.workflow_revision_id = resp.workflowRevisionId
            }
          } catch (err: any) {
            result.n_executions_errored++
            const message = `failed to create workflow execution with argument [${argument}]`
            failures.push(message)
            request.log(['audit', 'debug'], {
              message,
              original_error_message: err.message
            })
          }
        }

        try {
          request.log(['audit', 'debug'], {
            message: `delete row[${row.rowIndex}] ${row.a1Range} (URL ${row.url})`
          })
          await row.delete()
        } catch (err: any) {
          const message = `failed to delete row[${row.rowIndex}] ${row.a1Range}`
          request.log(['audit', 'warning'], {
            message,
            original_error_message: err.message
          })
          warnings.push(message)
        }
      }

      successes.push(
        `${result.urls_retrieved_from_sheet} rows retrieved from sheet [${queue_sheet.title}]`
      )

      const workflow_info = result.workflow_revision_id
        ? `workflow path [${workflow_path}] (revision ${result.workflow_revision_id})`
        : `workflow path [${workflow_path}]`

      const executions_info = `workflow executions: ${result.n_executions_created} created, ${result.n_executions_errored} errored`

      const description = `retrieved ${result.urls_retrieved_from_sheet} rows from Google Worksheet <a href="https://docs.google.com/spreadsheets/d/${doc.spreadsheetId}">${doc.title}</a>, sheet <b>${queue_sheet.title}</b>; ${executions_info}`

      try {
        const { message } = await sendTelegramMessage({
          chat_id: telegram_chat_id,
          token: telegram_token,
          text: operationListText({
            app_name: service_name,
            app_version: service_version,
            description,
            links: [{ href: cloud_run_logs_href, text: 'Cloud Run logs' }],
            operations: [
              {
                successes,
                failures,
                warnings,
                title: 'performance audit from Google Sheet'
              }
            ]
          })
        })
        request.log(['audit', 'debug'], { message })
      } catch (err: any) {
        const message = 'Telegram message not sent'
        request.log(['audit', 'warning'], {
          message,
          original_error_message: err.message
        })
      }

      return {
        message: description,
        executions_created: result.n_executions_created,
        executions_errored: result.n_executions_errored,
        urls_retrieved_from_sheet: result.urls_retrieved_from_sheet,
        workflow_info
      }
    }
  }
}
