import { errorCodeToStatusCode } from '../lib/error.js'

describe('errorCodeToStatusCode', () => {
  it('returns 500 for an unknown errorcode', () => {
    expect(errorCodeToStatusCode('some-unknown-errorcode')).toBe(500)
  })
})
