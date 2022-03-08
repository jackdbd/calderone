import { isApiKeyLiveMode, isApiKeyTestMode } from '../lib/checks.js'

describe('isApiKeyLiveMode', () => {
  it('is true if it starts with `sk_live_`', () => {
    expect(isApiKeyLiveMode('sk_live_something')).toBeTruthy()
  })

  it('is false if it starts with `sk_test_`', () => {
    expect(isApiKeyLiveMode('sk_test_something')).toBeFalsy()
  })
})

describe('isApiKeyTestMode', () => {
  it('is true if it starts with `sk_test_`', () => {
    expect(isApiKeyTestMode('sk_test_something')).toBeTruthy()
  })

  it('is false if it starts with `sk_live_`', () => {
    expect(isApiKeyTestMode('sk_live_something')).toBeFalsy()
  })
})
