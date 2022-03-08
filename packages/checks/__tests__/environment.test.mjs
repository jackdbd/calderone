import {
  isOnGithub,
  isDevelopment,
  isTest,
  isOnCloudFunctions,
  isOnCloudRun
} from '../lib/environment.js'

describe('isOnGithub', () => {
  it('is true when env has GITHUB_SHA', () => {
    const env = { GITHUB_SHA: 'some-sha' }
    expect(isOnGithub(env)).toBeTruthy()
  })
  it('is false when env has no GITHUB_SHA', () => {
    const env = { GITHUB_SHA: undefined }
    expect(isOnGithub(env)).toBeFalsy()
  })
})

describe('isTest', () => {
  it('is true when env has NODE_ENV = test', () => {
    const env = { NODE_ENV: 'test' }
    expect(isTest(env)).toBeTruthy()
  })
  it('is false when env has NODE_ENV = production', () => {
    const env = { NODE_ENV: 'production' }
    expect(isTest(env)).toBeFalsy()
  })
})

describe('isDevelopment', () => {
  it('is true when env has NODE_ENV = development', () => {
    const env = { NODE_ENV: 'development' }
    expect(isDevelopment(env)).toBeTruthy()
  })
  it('is false when env has NODE_ENV = production', () => {
    const env = { NODE_ENV: 'production' }
    expect(isDevelopment(env)).toBeFalsy()
  })
})

describe('isOnCloudFunctions', () => {
  it('is true when env has FUNCTION_SIGNATURE_TYPE', () => {
    const env = { FUNCTION_SIGNATURE_TYPE: 'some-string' }
    expect(isOnCloudFunctions(env)).toBeTruthy()
  })
})

describe('isOnCloudRun', () => {
  it('is true when env has K_SERVICE', () => {
    const env = { K_SERVICE: 'some-string' }
    expect(isOnCloudRun(env)).toBeTruthy()
  })
})
