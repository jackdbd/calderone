import { cspDirectives, cspHeader, cspJSON } from '../lib/csp-directives.js'
import { DIRECTIVES, PATTERNS } from './constants.mjs'
import { isObject, isString } from '../lib/utils.js'

describe('cspDirectives', () => {
  it('is an array', async () => {
    const arr = await cspDirectives({
      directives: DIRECTIVES,
      patterns: PATTERNS
    })

    expect(arr).toBeDefined()
    expect(arr.length).toBe(Object.keys(DIRECTIVES).length)
  })
})

describe('cspHeader', () => {
  it('is a string', async () => {
    const header = await cspHeader({
      directives: DIRECTIVES,
      patterns: PATTERNS
    })

    expect(header).toBeDefined()
    expect(isString(header)).toBeTruthy()
  })
})

describe('cspJSON', () => {
  it('is a JS object', async () => {
    const json = await cspJSON({
      directives: DIRECTIVES,
      patterns: PATTERNS
    })

    expect(json).toBeDefined()
    expect(isObject(json)).toBeTruthy()
  })
})
