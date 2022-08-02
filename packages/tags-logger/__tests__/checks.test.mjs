import {
  hasAtLeastOneSeverityTag,
  isEmptyObject,
  isNamespaceInEnvVarDEBUG,
  shouldLog
} from '../lib/checks.js'
import { SEVERITY_TAG_VALUES } from '../lib/constants.js'

describe('hasAtLeastOneSeverityTag', () => {
  it('is falsy when both strings are empty', () => {
    expect(hasAtLeastOneSeverityTag('', '')).toBeFalsy()
  })

  it(`is falsy when the 2 strings are 'foo' and 'bar'`, () => {
    expect(hasAtLeastOneSeverityTag('foo', 'bar')).toBeFalsy()
  })

  it(`is truthy when both strings are the same severity value`, () => {
    SEVERITY_TAG_VALUES.forEach((severity) => {
      expect(hasAtLeastOneSeverityTag(severity, severity)).toBeTruthy()
    })
  })

  it(`is falsy when a string is a severity value, and the other on is 'foo'`, () => {
    SEVERITY_TAG_VALUES.forEach((severity) => {
      expect(hasAtLeastOneSeverityTag(severity, 'foo')).toBeFalsy()
    })
  })

  it(`is truthy when both strings are different severity values`, () => {
    SEVERITY_TAG_VALUES.forEach((a, i) => {
      const b =
        i === SEVERITY_TAG_VALUES.length - 1
          ? SEVERITY_TAG_VALUES[0]
          : SEVERITY_TAG_VALUES[i + 1]

      // console.log(`${severity_a},${severity_b}`)
      expect(hasAtLeastOneSeverityTag(a, b)).toBeTruthy()
    })
  })
})

describe('isEmptyObject', () => {
  it('is falsy for a number', () => {
    expect(isEmptyObject(0)).toBeFalsy()
  })

  it('is falsy for a string', () => {
    expect(isEmptyObject('foo')).toBeFalsy()
  })

  it('is falsy for a Date', () => {
    expect(isEmptyObject(new Date())).toBeFalsy()
  })

  it('is falsy for an empty Map', () => {
    expect(isEmptyObject(new Map())).toBeFalsy()
  })

  it('is falsy for an object that contains an entry', () => {
    expect(isEmptyObject({ answer: 42 })).toBeFalsy()
  })

  it('is truthy for an object that contains no entries', () => {
    expect(isEmptyObject({})).toBeTruthy()
  })
})

describe('isNamespaceInEnvVarDEBUG', () => {
  const original_DEBUG = process.env.DEBUG

  afterEach(() => {
    process.env.DEBUG = original_DEBUG
  })

  it('is falsy when the environment variable `DEBUG` is not set', () => {
    delete process.env.DEBUG

    expect(isNamespaceInEnvVarDEBUG('foo')).toBeFalsy()
  })

  it('is truthy when the namespace matches `process.env.DEBUG`', () => {
    const arr = ['foo', 'bar', 'baz']

    arr.forEach((value) => {
      process.env.DEBUG = value

      expect(isNamespaceInEnvVarDEBUG(value)).toBeTruthy()
    })
  })

  it('is truthy when the namespace is included in `process.env.DEBUG`', () => {
    const arr = [
      'foo,other,stuff',
      'bar,some-other,thing',
      'baz,yet-another,thing'
    ]

    arr.forEach((value) => {
      process.env.DEBUG = value
      const namespace = value.split(',')[0]

      expect(isNamespaceInEnvVarDEBUG(namespace)).toBeTruthy()
    })
  })
})

describe('shouldLog', () => {
  const original_DEBUG = process.env.DEBUG
  const original_LOGGER_TAGS = process.env.LOGGER_TAGS

  afterEach(() => {
    process.env.DEBUG = original_DEBUG
    process.env.LOGGER_TAGS = original_LOGGER_TAGS
  })

  it('is falsy when there is nothing to log', () => {
    const arr = [undefined, null, '']

    arr.forEach((value) => {
      expect(shouldLog(value)).toBeFalsy()
    })
  })

  it('is falsy when the statement to log has no `tags` field', () => {
    const statement = { message: 'I have no tags' }

    expect(shouldLog(statement)).toBeFalsy()
  })

  it('is falsy when the statement to log has an empty `tags` field', () => {
    const statement = { message: 'I have no tags', tags: [] }

    expect(shouldLog(statement)).toBeFalsy()
  })

  it('is truthy when `process.env.LOGGER_TAGS` is not set (the default behavior should be logging all tags)', () => {
    delete process.env.LOGGER_TAGS // not sure if this works every time
    const statement = { message: 'I have some tags', tags: ['foo', 'bar'] }

    expect(shouldLog(statement)).toBeTruthy()
  })

  it('is truthy when a tag is included in `process.env.LOGGER_TAGS`', () => {
    process.env.LOGGER_TAGS = 'foo'
    const statement = { message: 'I have some tags', tags: ['foo', 'bar'] }

    expect(shouldLog(statement)).toBeTruthy()
  })

  it('is falsy when a tag is not included in `process.env.LOGGER_TAGS`', () => {
    process.env.LOGGER_TAGS = 'baz'
    const statement = { message: 'I have some tags', tags: ['foo', 'bar'] }

    expect(shouldLog(statement)).toBeFalsy()
  })
})
