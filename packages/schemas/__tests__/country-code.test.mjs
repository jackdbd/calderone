import Ajv from 'ajv'
import { SchemaId } from '../lib/constants.js'
import { country_code } from '../lib/country-code.js'

describe('country_code', () => {
  // do NOT use allErrors in production
  // https://ajv.js.org/security.html#security-risks-of-trusted-schemas
  const ajv = new Ajv({
    allErrors: true,
    schemas: [country_code]
  })

  const validate = ajv.getSchema(SchemaId.CountryCode)

  it('is valid for: `DE`, `ES`, `IT`, `UK', () => {
    const COUNTRIES = ['DE', 'ES', 'IT', 'UK']
    COUNTRIES.forEach((code) => {
      const valid = validate(code)

      expect(valid).toBeTruthy()
      expect(validate.errors).toBeNull()
    })
  })

  it('is not valid for `ITA`', () => {
    const valid = validate('ITA')

    expect(valid).toBeFalsy()
    expect(validate.errors.length).toBeGreaterThan(0)
  })
})
