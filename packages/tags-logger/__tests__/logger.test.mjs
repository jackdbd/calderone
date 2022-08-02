import { makeLogger } from '../lib/logger.js'
import { ERROR_MESSAGE } from '../lib/constants.js'

describe('makeLogger', () => {
  const original_DEBUG = process.env.DEBUG

  afterEach(() => {
    process.env.DEBUG = original_DEBUG
  })

  it('throws when the environment variable `DEBUG` is not set, and it is not logging JSON', () => {
    delete process.env.DEBUG

    expect(() => {
      makeLogger({
        should_use_json_logger: false
      })
    }).toThrowError(ERROR_MESSAGE.DEBUG_IS_NOT_SET)
  })

  it('does not throw when the environment variable `DEBUG` is not set, and it is logging JSON', () => {
    delete process.env.DEBUG

    const logger = makeLogger({
      should_use_json_logger: true
    })

    expect(logger).toBeDefined()
  })

  it('throws when `should_throw_if_namespace_not_in_DEBUG` is true, the `namespace` is not included in the environment variable `DEBUG`, and it is not logging JSON', () => {
    process.env.DEBUG = 'foo,bar'

    expect(() => {
      makeLogger({
        namespace: 'baz',
        should_throw_if_namespace_not_in_DEBUG: true,
        should_use_json_logger: false
      })
    }).toThrowError(ERROR_MESSAGE.NAMESPACE_NOT_INCLUDED_IN_DEBUG)
  })

  it('does not throw when `should_throw_if_namespace_not_in_DEBUG` is true, the `namespace` is not included in the environment variable `DEBUG`, and it is logging JSON', () => {
    process.env.DEBUG = 'foo,bar'

    const logger = makeLogger({
      namespace: 'baz',
      should_throw_if_namespace_not_in_DEBUG: true,
      should_use_json_logger: true
    })

    expect(logger).toBeDefined()
  })

  it('does not throw when the `namespace` is not included in the environment variable `DEBUG`, and it is not logging JSON', () => {
    process.env.DEBUG = 'foo,bar'

    const logger = makeLogger({
      namespace: 'baz',
      should_use_json_logger: false
    })

    expect(logger).toBeDefined()
  })

  it('does not throw when the `namespace` is not included in the environment variable `DEBUG`, and it is logging JSON', () => {
    process.env.DEBUG = 'foo,bar'

    const logger = makeLogger({
      namespace: 'baz',
      should_use_json_logger: true
    })

    expect(logger).toBeDefined()
  })

  // it('aaa', () => {
  //   delete process.env.DEBUG
  //   const logger = makeLogger({ should_throw_if_namespace_not_in_DEBUG: true })

  //   expect(logger).toBeDefined()
  // })
})
