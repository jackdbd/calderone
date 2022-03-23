import Boom from '@hapi/boom'
import type Hapi from '@hapi/hapi'
import { send } from '@jackdbd/notifications/telegram'
import { REQUEST_TAGS } from './constants.js'
import type { RequestPayload } from './interfaces.js'
import { isDeployStarted, isFormSubmission } from './type-guards.js'
import { deployStartedToSummary, formSubmissionToSummary } from './utils.js'
import { formSubmissionText } from './telegram-text-messages.js'

export interface ConfigGet {
  path: string
  site_url: string
}

// TODO: make an authenticated request (OAuth 2) to this URL:
// https://api.netlify.com/api/v1/sites/<SITE_ID>/forms
export const routeGet = ({ path, site_url }: ConfigGet): Hapi.ServerRoute => {
  return {
    method: 'GET',
    path,
    options: {
      auth: false, // probably we want authentication here...
      description: 'display info about Netlify webhook events',
      tags: REQUEST_TAGS
    },
    handler: async (request, _h) => {
      request.log(REQUEST_TAGS, {
        message: 'got request at Netlify webhook event handler'
      })
      return {
        site_url
      }
    }
  }
}

export interface ConfigPost {
  path: string
  site_name: string
  telegram_chat_id: string
  telegram_token: string
}

export const routePost = ({
  path,
  site_name,
  telegram_chat_id,
  telegram_token
}: ConfigPost): Hapi.ServerRoute => {
  //
  return {
    method: 'POST',
    path,
    options: {
      auth: false,
      description: 'handle incoming Netlify webhook events',
      tags: REQUEST_TAGS
    },
    handler: async (request, _h) => {
      // console.log('request.payload', request.payload)
      // console.log('request.headers', request.headers)
      request.log(REQUEST_TAGS, {
        message: 'got request at Netlify webhook event handler'
      })

      // TODO: verify that the received request body is really a webhook event from Netlify
      // https://docs.netlify.com/site-deploys/notifications/#payload-signature

      // Apparently, IP whitelisting is not possible, since the Netlify API does
      // not use always the same IP addresses.
      // https://answers.netlify.com/t/list-of-netlify-ip-adresses-for-whitelisting/1338/2

      if (!request.headers['x-netlify-event']) {
        throw Boom.unauthorized()
      }
      // 'x-netlify-event': 'submission_created'

      if (!request.payload) {
        throw Boom.badRequest()
      }

      let text: string
      const payload = request.payload as RequestPayload

      // TODO: use AJV or Joi to validate incoming webhook events

      if (isFormSubmission(payload)) {
        const { form_id, form_name } = payload
        const summary = formSubmissionToSummary(payload)
        text = formSubmissionText({ ...summary, site_name })
        request.log(REQUEST_TAGS, {
          message: `New submission for the form ${form_name} [id: ${form_id}]`
        })
      } else if (isDeployStarted(payload)) {
        const { branch } = payload
        const summary = deployStartedToSummary(payload)
        text = `deploy started [branch: ${branch}]`
        request.log(REQUEST_TAGS, { message: text, summary })
      } else {
        const message = `event not handled. Is this really a Netlify event?`
        request.log(REQUEST_TAGS, { message, payload })
        throw Boom.badRequest(message)
      }

      // TODO: maybe use @hapi.wreck for this HTTP request
      try {
        const { delivered, message, delivered_at } = await send({
          text,
          chat_id: telegram_chat_id,
          token: telegram_token
        })
        return { message, delivered, delivered_at }
      } catch (err: any) {
        const message = `could not send message to Telegram chat ${telegram_chat_id}: ${err.message}`
        throw Boom.internal(message)
      }
    }
  }
}
