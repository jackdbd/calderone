import { hasAtLeastOneSeverityTag, isEmptyObject } from '../lib/checks.js'
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

      // console.log(`${a},${b}`)
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
