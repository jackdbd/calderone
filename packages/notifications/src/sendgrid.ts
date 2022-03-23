import { debuglog } from 'node:util'
import email from '@sendgrid/mail'
import type { ResponseError } from '@sendgrid/mail'

const debug = debuglog('notifications/sendgrid')

export interface Config {
  from: string
  html: string
  sendgrid_api_key: string
  subject: string
  to: string | string[]
}

export interface Options {
  /**
   * https://docs.sendgrid.com/for-developers/sending-email/personalizations
   */
  template_id?: string
}

interface ErrorMessageConfig {
  err: ResponseError
}

const errorMessageFromSendgridApi = ({ err }: ErrorMessageConfig) => {
  const errors = (err.response.body as any).errors
  const error_messages = errors.map((error: any) => error.message) as string[]
  const error_message = error_messages.join('; ')

  switch (err.code) {
    case 400:
    case 401: {
      return error_message
    }

    default: {
      return error_message
    }
  }
}

export interface SuccessResponse {
  message: string
  sendgrid_message_id: string
}

/**
 * Send an email to one or more recipients, using the SendGrid API.
 *
 * https://docs.sendgrid.com/api-reference/mail-send/mail-send#body
 */
export const send = async (
  { from, html, sendgrid_api_key, subject, to }: Config,
  options?: Options
) => {
  if (!sendgrid_api_key) {
    throw new Error('sendgrid_api_key not set')
  }
  if (!from) {
    throw new Error('from not set')
  }
  if (!to) {
    throw new Error('to not set')
  }
  if (!subject) {
    throw new Error('subject not set')
  }

  debug('options: %O', options)

  // https://docs.sendgrid.com/for-developers/sending-email/personalizations
  // const template_id = options?.template_id

  email.setApiKey(sendgrid_api_key)

  const recipient = Array.isArray(to) ? to.join(', ') : to

  const data = {
    from,
    html,
    subject,
    to
  }

  // https://www.twilio.com/blog/sending-bulk-emails-3-ways-sendgrid-nodejs
  const isMultiple = undefined

  try {
    const [res] = await email.send(data, isMultiple)
    return {
      message: `email from ${from} to ${recipient} will be delivered by SendGrid`,
      sendgrid_message_id: res.headers['x-message-id']
    } as SuccessResponse
  } catch (err: any) {
    debug(`SendGrid API could not respond. Original error: %O`, err)
    throw new Error(errorMessageFromSendgridApi({ err: err as ResponseError }))
  }
}
