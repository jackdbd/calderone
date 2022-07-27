/**
 * Checks whether the given string is an API key for a Stripe account in `live` mode.
 *
 * @public
 */
export const isApiKeyLiveMode = (s: string) => {
  return s.slice(0, 8) === 'sk_live_'
}

/**
 * Checks whether the given string is an API key for a Stripe account in `test` mode.
 *
 * @public
 */
export const isApiKeyTestMode = (s: string) => {
  return s.slice(0, 8) === 'sk_test_'
}
