import makeDebug from 'debug'
import type { APIResponseBodyError } from './interfaces.js'

const debug = makeDebug('fattureincloud-client/error')

/**
 * Convert a FattureInCloud error code in an appropriate HTTP status code.
 *
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Richiesta_generica/JSONRequest
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Documenti_emessi/DocNuovo
 */
export const statusCodeFromErrorCode = (error_code: number) => {
  debug(`statusCodeFromErrorCode ${error_code}`)
  switch (error_code) {
    case 1001:
    case 1100:
    case 2000:
    case 4001:
    case 5000:
      // Bad Request
      return 400
    case 1000:
      // Unauthorized
      return 401
    case 1004:
    case 4000:
      // Not Found, or 410 Gone?
      return 404
    case 2004:
    case 2005:
    case 2006:
      // Forbidden
      return 403
    case 2002:
    case 2007:
      // Too Many Requests
      return 429
    default:
      return 500
  }
}

export const statusCodeFromErrorMessage = (errorMessage: string) => {
  return parseInt(errorMessage.slice(1, 4))
}

export const newErrorFromApiError = ({
  error,
  error_code
}: APIResponseBodyError) => {
  if (!error) {
    throw new Error(
      'you should not call this function without an `error` (string)'
    )
  }

  if (error.match(/Il codice ISO paese non è valido/)) {
    return new Error(`[400] ${error}`)
  } else {
    if (error_code) {
      return new Error(`[${statusCodeFromErrorCode(error_code)}] ${error}`)
    } else {
      return new Error(`[${500}] ${error}`)
    }
  }
}
