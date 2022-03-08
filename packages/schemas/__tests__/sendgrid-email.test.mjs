import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { SchemaId } from '../lib/constants.js'
import { sendgrid_email } from '../lib/sendgrid-email.js'

describe('sendgrid_email', () => {
  // do NOT use allErrors in production
  // https://ajv.js.org/security.html#security-risks-of-trusted-schemas
  const ajv = new Ajv({
    allErrors: true,
    schemas: [sendgrid_email]
  })
  addFormats(ajv)

  const validate = ajv.getSchema(SchemaId.SendGridEmail)

  it('is valid whan all data are provided', () => {
    const data = {
      from: 'john@doe.com',
      to: ['xyz@gmail.com'],
      subject: 'this is the email subject',
      html: 'this is the email HTML'
    }
    const valid = validate(data)

    expect(valid).toBeTruthy()
    expect(validate.errors).toBeNull()
  })

  it('is not valid when `subject` is empty', () => {
    const data = {
      from: 'john@doe.com',
      to: ['xyz@gmail.com'],
      subject: '',
      html: 'this is the email HTML'
    }
    const valid = validate(data)

    expect(valid).toBeFalsy()
    expect(validate.errors.length).toBeGreaterThan(0)
  })

  it('is not valid when `html` is empty', () => {
    const data = {
      from: 'john@doe.com',
      to: ['xyz@gmail.com'],
      subject: 'this is the email subject'
    }
    const valid = validate(data)

    expect(valid).toBeFalsy()
    expect(validate.errors.length).toBeGreaterThan(0)
  })
})
