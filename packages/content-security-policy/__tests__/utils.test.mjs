import { isObject, isString } from '../lib/utils.js'

describe('isObject', () => {
  it('is true for `{}`', () => {
    expect(isObject({})).toBeTruthy()
  })

  it('is false for `123`', () => {
    expect(isObject(123)).toBeFalsy()
  })
})

describe('isString', () => {
  it('is true for `"hello"`', () => {
    expect(isString('hello')).toBeTruthy()
  })

  it('is false for `123`', () => {
    expect(isString(123)).toBeFalsy()
  })
})
