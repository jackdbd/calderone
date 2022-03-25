import Boom from '@hapi/boom'
import type Hapi from '@hapi/hapi'
import { sendTelegramMessage } from '@jackdbd/notifications'
import { operationListText } from '@jackdbd/telegram-text-messages'

interface Config {
  service_name: string
  service_version: string
  telegram_chat_id: string
  telegram_token: string
}

// https://cloud.google.com/monitoring/support/notification-options#webhooks
// example in python
// https://gist.github.com/tschieggm/7604940

export const alertsPost = ({
  service_name,
  service_version,
  telegram_chat_id,
  telegram_token
}: Config): Hapi.ServerRoute => {
  const config = { method: 'POST', path: '/alerts' }
  return {
    method: config.method,
    options: { auth: false }, // maybe use basic auth?
    path: config.path,
    handler: async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
      const payload = request.payload as any
      if (!payload && !payload.incident) {
        throw Boom.badRequest()
      }

      const incident_summary = payload.incident.summary
      const incident_url = payload.incident.url
      const policy_name = payload.incident.policy_name
      const condition_name = payload.incident.condition_name

      const successes: string[] = []
      const failures: string[] = []
      const warnings: string[] = []

      warnings.push(incident_summary)

      try {
        const { message, delivered, delivered_at } = await sendTelegramMessage({
          chat_id: telegram_chat_id,
          token: telegram_token,
          text: operationListText({
            app_name: service_name,
            app_version: service_version,
            description: `the alerting policy ${policy_name} was triggered because the condition ${condition_name} failed. See <a href="${incident_url}" target="_blank">incident here</a>.`,
            operations: [
              {
                successes,
                failures,
                warnings,
                title: `Alerting policy: ${policy_name}`
              }
            ]
          })
        })
        request.log(['telegram', 'debug'], { message, delivered, delivered_at })
      } catch (err: any) {
        const message = `could not send Telegram message`
        request.log(['telegram', 'warning'], {
          message,
          original_error_message: err.message
        })
        warnings.push(message)
      }

      if (failures.length === 0) {
        return { message: 'received alert from GCP', successes, warnings }
      } else {
        throw Boom.internal()
      }
    }
  }
}
