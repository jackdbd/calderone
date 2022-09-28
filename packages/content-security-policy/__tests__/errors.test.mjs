import Joi from 'joi'
import { validationErrorOrWarnings } from '../lib/errors.js'

describe('validationErrorOrWarnings', () => {
  it('is defined when the configuration is invalid', () => {
    const message = 'this is a validation error'
    const details = [{ path: [] }]
    const original = {}
    const error = new Joi.ValidationError(message, details, original)

    const result = validationErrorOrWarnings({
      error,
      allowDeprecatedDirectives: false
    })

    expect(result.error).toBeDefined()
    expect(result.error.message).toContain('invalid configuration')
  })

  it('is an error when the configuration is valid but it is used a deprecated CSP directive and allowDeprecatedDirectives is false', () => {
    const deprecated_directive = 'block-all-mixed-content'
    const message = 'this is a validation error'
    const details = [{ path: ['foo', deprecated_directive] }]
    const original = {}

    const { error, warnings } = validationErrorOrWarnings({
      error: new Joi.ValidationError(message, details, original),
      allowDeprecatedDirectives: false
    })

    expect(error).toBeDefined()
    expect(error.message).toContain('invalid configuration')
    expect(error.message).toContain('deprecated directive')
    expect(error.message).toContain(deprecated_directive)
    expect(warnings.length).toBe(0)
  })

  it('is a warning when the configuration is valid but it is used a deprecated CSP directive and allowDeprecatedDirectives is true', () => {
    const deprecated_directive = 'block-all-mixed-content'
    const message = 'this is a validation error'
    const details = [{ path: ['foo', deprecated_directive] }]
    const original = {}

    const { error, warnings } = validationErrorOrWarnings({
      error: new Joi.ValidationError(message, details, original),
      allowDeprecatedDirectives: true
    })

    expect(error).not.toBeDefined()
    expect(warnings.length).toBe(1)
    const warning = warnings[0]
    expect(warning).toContain('deprecated')
    expect(warning).toContain(deprecated_directive)
  })
})
