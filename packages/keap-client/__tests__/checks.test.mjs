import { isAccessTokenExpired, isAccessTokenInvalid } from '../lib/checks.js'

describe('isAccessTokenExpired', () => {
  it('is true when string contains `Access Token expired`', () => {
    expect(isAccessTokenExpired('Access Token expired')).toBeTruthy()
  })
})

describe('isAccessTokenInvalid', () => {
  it('is true when string contains `Invalid Access Token`', () => {
    expect(isAccessTokenInvalid('Invalid Access Token')).toBeTruthy()
  })
})
