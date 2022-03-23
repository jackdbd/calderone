import makeDebug from 'debug'

const debug = makeDebug('keap-client/checks')

export const isAccessTokenInvalid = (s: string) => {
  const b = s.indexOf('Invalid Access Token') !== -1
  debug(`isAccessTokenInvalid? [${s}] ${b}`)
  return b
}

export const isAccessTokenExpired = (s: string) => {
  const b = s.indexOf('Access Token expired') !== -1
  debug(`isAccessTokenExpired? [${s}] ${b}`)
  return b
}

export const isContactNotFound = (s?: string) => {
  return s === 'Unable to find this Contact'
}
