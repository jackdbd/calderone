import Joi from 'joi'
import { csp_scheme_source, csp_source_values } from '../lib/schemas.js'

describe('csp_scheme_source', () => {
  it('is not valid for `foo`', () => {
    const result = csp_scheme_source.validate('foo')

    expect(result.error).toBeDefined()
    expect(result.error.message).toContain('must be one of')
  })

  it('is valid for each one of the supported schemes`', () => {
    const schemes = [
      'http:',
      'https:',
      'blob:',
      'data:',
      'filesystem:',
      'mediastream:'
    ]

    schemes.forEach((scheme) => {
      const { error, value } = csp_scheme_source.validate(scheme)

      expect(error).not.toBeDefined()
      expect(value).toBe(scheme)
    })
  })
})

describe('csp_source_values', () => {
  it('must contain at least one item', () => {
    const result = csp_source_values.validate([])

    expect(result.error).toBeDefined()
    expect(result.error.message).toContain('must contain at least 1 items')
  })

  it('is valid for each one of the supported CSP source values', () => {
    const source_values = [
      ['self'],
      ['unsafe-eval'],
      ['unsafe-hashes'],
      ['self', 'unsafe-inline']
    ]

    source_values.forEach((source_value) => {
      const { error, value } = csp_source_values.validate(source_value)

      expect(error).not.toBeDefined()
      expect(JSON.stringify(value)).toBe(JSON.stringify(source_value))
    })
  })
})
