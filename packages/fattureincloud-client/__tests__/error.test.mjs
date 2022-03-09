import {
  statusCodeFromErrorCode,
  statusCodeFromErrorMessage
} from '../lib/error.js'

describe('statusCodeFromErrorCode', () => {
  it('codes converted to HTTP Bad Request (400)', () => {
    const fattureincloud_codes = [1001, 1100, 2000, 4001, 5000]

    fattureincloud_codes.forEach((code) => {
      expect(statusCodeFromErrorCode(code)).toBe(400)
    })
  })

  it('codes converted to HTTP Unauthorized (401)', () => {
    const fattureincloud_codes = [1000]

    fattureincloud_codes.forEach((code) => {
      expect(statusCodeFromErrorCode(code)).toBe(401)
    })
  })

  it('codes converted to HTTP Not Found (404)', () => {
    const fattureincloud_codes = [1004, 4000]

    fattureincloud_codes.forEach((code) => {
      expect(statusCodeFromErrorCode(code)).toBe(404)
    })
  })

  it('codes converted to HTTP Forbidden (403)', () => {
    const fattureincloud_codes = [2004, 2005, 2006]

    fattureincloud_codes.forEach((code) => {
      expect(statusCodeFromErrorCode(code)).toBe(403)
    })
  })

  it('codes converted to HTTP Too Many Requests (429)', () => {
    const fattureincloud_codes = [2002]

    fattureincloud_codes.forEach((code) => {
      expect(statusCodeFromErrorCode(code)).toBe(429)
    })
  })

  it('codes converted to HTTP Internal Server Error (500)', () => {
    const fattureincloud_codes = [1, 2, 3]

    fattureincloud_codes.forEach((code) => {
      expect(statusCodeFromErrorCode(code)).toBe(500)
    })
  })
})

describe('statusCodeFromErrorMessage', () => {
  it('extracts the status code from the error message', () => {
    const error_message = '[400] Some client error'

    expect(statusCodeFromErrorMessage(error_message)).toBe(400)
  })
})
