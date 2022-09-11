import type Stripe from 'stripe'
import Boom from '@hapi/boom'
import type Hapi from '@hapi/hapi'
import { sendTelegramMessage } from '@jackdbd/notifications'
import { enabledEventsForWebhookEndpoint } from '@jackdbd/stripe-utils/webhooks'
import { anchor } from '@jackdbd/telegram-text-messages/utils'
import { Emoji } from '../../constants.js'

export const eventIsIgnoredMessage = (event_type: string, url: string) =>
  `This Stripe account is not configured to POST ${event_type} events to this endpoint [${url}] so the event is ignored.`

export const incorrectRequestBody =
  'Incorrect request body. Received a request body that does not look like a Stripe event.'

interface Config {
  stripe: Stripe
  telegram_chat_id: string
  telegram_token: string
  webhook_endpoint: string
  webhook_secret: string
}

const TAGS = ['api', 'handler', 'stripe', 'webhook']

interface SendConfig {
  chat_id: string
  token: string
  text: string
}

const trySendingTelegramMessage = async ({
  chat_id,
  token,
  text
}: SendConfig) => {
  try {
    const { message, delivered } = await sendTelegramMessage(
      {
        chat_id,
        token,
        text
      },
      { disable_web_page_preview: true }
    )
    return { value: { delivered, message } }
  } catch (err: any) {
    return { error: err as Error }
  }
}

interface TextDetailsConfig {
  event: Stripe.Event
  resource_type: string
  resource_id: string
}

const textDetails = ({
  event,
  resource_id,
  resource_type
}: TextDetailsConfig) => {
  const href = event.livemode
    ? `https://dashboard.stripe.com/${resource_type}/${resource_id}`
    : `https://dashboard.stripe.com/test/${resource_type}/${resource_id}`

  const date_str = new Date(event.created * 1000).toUTCString()

  return [
    `API version: ${event.api_version}`,
    `Created: ${event.created} (${date_str})`,
    anchor({ href, text: resource_id })
  ]
}

export const stripePost = ({
  stripe,
  telegram_chat_id,
  telegram_token,
  webhook_endpoint,
  webhook_secret
}: Config): Hapi.ServerRoute => {
  return {
    handler: async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
      const header = request.headers['stripe-signature']

      if (!header) {
        const message = `incoming request lacks required header`
        // this is a client error, not an application error. So we log it as a warning
        request.log(['warning', 'stripe', 'webhook'], {
          message,
          required_header: 'stripe-signature',
          headers: request.headers
        })

        // we log the message but we don't respond to the client, so an eventual
        // attacker only sees bad request, and does learn that we require the
        // 'stripe-signature' header to be present.
        throw Boom.badRequest()
      }

      const payload = request.payload.toString()

      let event: Stripe.Event
      if (process.env.BYPASS_WEBHOOK_VALIDATION) {
        // hopefully this is clear enough
        const warnings = [
          `Environment variable BYPASS_WEBHOOK_VALIDATION was set`,
          `This should be used ONLY in development`,
          `NEVER set BYPASS_WEBHOOK_VALIDATION in production`,
          `ALWAYS validate incoming webhook events in production!`
        ]
        request.log(['warning', 'webhook', 'security'], {
          message: warnings.join('. ')
        })
        event = JSON.parse(payload) as Stripe.Event
      } else {
        try {
          event = stripe.webhooks.constructEvent(
            payload,
            header,
            webhook_secret
          )
        } catch (err: any) {
          const message = `could not construct event from request payload: ${err.message}`

          // this is a client error, not an application error. So we log it as a warning
          request.log(['warning', 'stripe', 'webhook'], { message })
          throw Boom.badRequest()
        }
      }

      const enabled_events = await enabledEventsForWebhookEndpoint({
        stripe,
        url: webhook_endpoint
      })

      if (!enabled_events.includes(event.type)) {
        const message = eventIsIgnoredMessage(event.type, webhook_endpoint)

        // this is a client error, not an application error. So we log it as a warning
        request.log(['warning', 'stripe', 'webhook'], {
          message,
          event_type: event.type,
          enabled_events
        })
        // TODO: also, send warning to Telegram?
        throw Boom.badRequest()
      }

      switch (event.type) {
        case 'customer.created':
        case 'customer.deleted':
        case 'customer.updated': {
          const resource_id = (event.data.object as any).id as string

          const text = [
            `${Emoji.Customer} Stripe webhook event <code>${event.type}</code>`,
            ...textDetails({ resource_type: 'customers', resource_id, event })
          ].join('\n\n')

          const { error, value } = await trySendingTelegramMessage({
            chat_id: telegram_chat_id,
            token: telegram_token,
            text
          })
          if (error) {
            request.log([...TAGS, 'telegram', 'error'], {
              message: `could not send Telegram message`,
              original_error_message: error.message
            })
          } else {
            const { delivered, message } = value
            if (delivered) {
              request.log([...TAGS, 'telegram'], { message, delivered })
            } else {
              request.log([...TAGS, 'telegram', 'warning'], { message })
            }
          }

          return {
            message: `processed "${event.type}" webhook event (coming from Stripe)`
          }
        }

        case 'payment_intent.succeeded': {
          const resource_id = (event.data.object as any).id as string

          const text = [
            `${Emoji.MoneyBag} Stripe webhook event <code>${event.type}</code>`,
            ...textDetails({ resource_type: 'payments', resource_id, event })
          ].join('\n\n')

          const { error, value } = await trySendingTelegramMessage({
            chat_id: telegram_chat_id,
            token: telegram_token,
            text
          })
          if (error) {
            request.log([...TAGS, 'telegram', 'error'], {
              message: `could not send Telegram message`,
              original_error_message: error.message
            })
          } else {
            const { delivered, message } = value
            if (delivered) {
              request.log([...TAGS, 'telegram'], { message, delivered })
            } else {
              request.log([...TAGS, 'telegram', 'warning'], { message })
            }
          }

          return {
            message: `processed "${event.type}" webhook event (coming from Stripe)`
          }
        }

        case 'product.created':
        case 'product.deleted':
        case 'product.updated': {
          const resource_id = (event.data.object as any).id as string

          const text = [
            `${Emoji.ShoppingBags} Stripe webhook event <code>${event.type}</code>`,
            ...textDetails({ resource_type: 'customers', resource_id, event })
          ].join('\n\n')

          const { error, value } = await trySendingTelegramMessage({
            chat_id: telegram_chat_id,
            token: telegram_token,
            text
          })
          if (error) {
            request.log([...TAGS, 'telegram', 'error'], {
              message: `could not send Telegram message`,
              original_error_message: error.message
            })
          } else {
            const { delivered, message } = value
            if (delivered) {
              request.log([...TAGS, 'telegram'], { message, delivered })
            } else {
              request.log([...TAGS, 'telegram', 'warning'], { message })
            }
          }

          return {
            message: `processed "${event.type}" webhook event (coming from Stripe)`
          }
        }

        default: {
          const event_type = (request.payload as any).type

          const message = event_type
            ? `event '${event_type}' not handled (this Stripe account can POST it, but there isn't a handler in this application)`
            : incorrectRequestBody

          request.log(['warning', 'stripe', 'webhook'], {
            message,
            params: request.params,
            payload: request.payload
          })

          throw Boom.badRequest(message)
        }
      }
    },

    method: 'POST',

    options: {
      auth: false,
      description: 'webhook target for Stripe webhook events',
      notes:
        'This route catches the webhook events sent by Stripe when something happens on the Stripe account',
      payload: { parse: false, output: 'data' },
      tags: TAGS,
      validate: {
        options: { allowUnknown: true },
        query: false
      }
    },

    path: '/stripe'
  }
}
