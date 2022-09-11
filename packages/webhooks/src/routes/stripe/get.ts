import type Stripe from 'stripe'
import type Hapi from '@hapi/hapi'
import { enabledEventsForWebhookEndpoint } from '@jackdbd/stripe-utils/webhooks'

interface Config {
  stripe: Stripe
  webhook_endpoint: string
}

export const stripeGet = ({ stripe, webhook_endpoint }: Config) => {
  const config = { method: 'GET', path: '/stripe' }

  return {
    method: config.method,
    path: config.path,
    handler: async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
      const enabled_events = await enabledEventsForWebhookEndpoint({
        stripe,
        url: webhook_endpoint
      })

      request.log(['debug', 'stripe', 'webhook'], {
        message: `${enabled_events.length} webhook event/s allowed to POST to ${webhook_endpoint}`
      })

      return {
        enabled_events,
        message: `This Stripe account is configured to POST ${enabled_events.length} webhook event/s to ${webhook_endpoint}`
      }
    }
  }
}
