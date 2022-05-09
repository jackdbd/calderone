import type { JSONSchemaType } from 'ajv'
import { SchemaId } from './constants.js'

interface Data {
  from: string
  html: string
  subject: string
  to: string | string[]
}

// https://docs.sendgrid.com/for-developers/sending-email/v3-mail-send-faq#are-there-limits-on-how-often-i-can-send-email-and-how-many-recipients-i-can-send-to
const MAX_RECIPIENTS = 1000

// format is available only when ajv-formats is used
// https://github.com/ajv-validator/ajv-formats

export const sendgrid_email: JSONSchemaType<Data> = {
  $id: SchemaId.SendGridEmail,
  type: 'object',
  properties: {
    from: { type: 'string', format: 'email' },
    html: { type: 'string', minLength: 1 },
    subject: { type: 'string', minLength: 1 },
    to: {
      anyOf: [
        { type: 'string', format: 'email' },
        {
          type: 'array',
          items: { type: 'string', format: 'email' },
          minItems: 1,
          maxItems: MAX_RECIPIENTS,
          uniqueItems: true
        }
      ]
    }
  },
  required: ['from', 'to', 'subject', 'html'],
  additionalProperties: false
}
