export interface Fault {
  detail: { errorcode: string }
  faultstring: string
}

/**
 * Convert a Keap API error code in an appropriate HTTP status code.
 */
export const errorCodeToStatusCode = (errorcode: string) => {
  switch (errorcode) {
    case 'keymanagement.service.invalid_access_token':
      // HTTP 401 Unauthorized
      // https://stackoverflow.com/questions/45153773/correct-http-code-for-authentication-token-expiry-401-or-403
      return 401
    case 'oauth.v2.InvalidAccessToken':
      // HTTP 400 Bad Request
      // https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/
      return 400
    default:
      return 500
  }
}

interface ApiErrorConfig {
  error_description?: string
  fault?: Fault
  message: string
}

export const apiError = ({
  error_description,
  fault,
  message
}: ApiErrorConfig) => {
  if (fault) {
    const status_code = errorCodeToStatusCode(fault.detail.errorcode)
    return new Error(`[${status_code}] ${message}: ${fault.faultstring}`)
  } else if (error_description) {
    return new Error(`[400] ${message}: ${error_description}`)
  } else if (message) {
    return new Error(`[400] ${message}`)
  } else {
    return new Error(`[500] ${message}`)
  }
}

export const access_token_not_set = 'access_token not set'

export const invalidAccessTokenErrorMessage = (what: string) => {
  return `[401] cannot retrieve ${what}: Invalid Access Token`
}

export const notFoundErrorMessage = (what: string) => {
  return `[404] ${what} NOT FOUND`
}

export const client_id_not_set = 'client_id not set'

export const client_secret_not_set = 'client_secret not set'

export const refresh_token_not_set = 'refresh_token not set'
