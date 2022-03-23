import fs from 'node:fs'
import path from 'node:path'
import makeDebug from 'debug'
import { isAccessTokenExpired, isAccessTokenInvalid } from './checks.js'

const debug = makeDebug('keap-client/utils')

export const monorepoRoot = () => {
  let current_dir = path.resolve('.')
  while (!fs.existsSync(path.join(current_dir, '.git'))) {
    current_dir = path.join(current_dir, '..')
  }
  return current_dir
}

// TODO find a better name
export const retryAfterTokenRefresh = (
  refresh: () => Promise<{ access_token: string; refresh_token: string }>,
  fn: (...args: any) => Promise<any>
) => {
  const wrapped = async (...args: any) => {
    debug('calling [%s] with its original args', fn.name)
    try {
      const res = await fn(...args)
      return res
    } catch (err: any) {
      if (
        isAccessTokenInvalid(err.message) ||
        isAccessTokenExpired(err.message)
      ) {
        debug(
          '[%s] failed because of an invalid/expired access token. Refresh the token and retry',
          fn.name
        )
        try {
          const { access_token } = await refresh()
          const res_wrapped = await fn(...args, access_token)
          debug('[%s] succeeded after a token refresh', fn.name)
          return res_wrapped
        } catch (err: any) {
          debug(
            '[%s] failed a second time after a token refresh. No more retries',
            fn.name
          )
          throw new Error(err.message)
        }
      } else {
        debug(
          '[%s] failed NOT because of an invalid/expired access token. Do not refresh nor retry: %s',
          fn.name,
          err.message
        )
        throw new Error(err.message)
      }
    }
  }
  return wrapped
}

export interface WrapRefreshRetryConfig {
  refresh: () => Promise<any>
  client: any
  // client: ContactsClient
}

/**
 * Wrap all methods of a Keap API endpoint (e.g. contacts/) in this block:
 * try once / refresh + persist token / try once more
 */
export const wrapRefreshRetry = ({
  refresh,
  client
}: WrapRefreshRetryConfig) => {
  debug('wrapRefreshRetry')
  const wrapped_client = {} as any
  Object.entries(client).forEach((entry) => {
    const [fn_name, fn] = entry
    debug(`wrap function "${fn_name}"`)
    const wrapped_fn = retryAfterTokenRefresh(refresh, fn as any)
    wrapped_client[fn_name] = wrapped_fn
  })
  return wrapped_client as typeof client
}
