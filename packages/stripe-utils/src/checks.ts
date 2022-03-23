export const isApiKeyLiveMode = (s: string) => {
  return s.slice(0, 8) === 'sk_live_'
}

export const isApiKeyTestMode = (s: string) => {
  return s.slice(0, 8) === 'sk_test_'
}
