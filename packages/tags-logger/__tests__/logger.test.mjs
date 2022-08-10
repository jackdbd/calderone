import { makeLog } from '../lib/logger.js'
import { ErrorMessage } from '../lib/constants.js'

describe('makeLog', () => {
  const original_DEBUG = process.env.DEBUG

  afterEach(() => {
    process.env.DEBUG = original_DEBUG
  })

  it('throws when it is passed an invalid configuration', () => {
    expect(() => {
      makeLog({ foo: 'bar' })
    }).toThrowError(ErrorMessage.INVALID_CONFIGURATION_ERROR_PREFIX)
  })

  it('is defined when the `namespace` is not included in the environment variable `DEBUG`', () => {
    process.env.DEBUG = 'foo,bar'

    const log = makeLog({ namespace: 'baz' })

    expect(log).toBeDefined()
  })
})
