import { setTimeout, clearTimeout } from 'node:timers'
import { isError, isTimeout } from '../lib/type-guards.js'

describe('isError', () => {
  it('is true if the input is an error', () => {
    expect(isError(new Error('some-error'))).toBeTruthy()
  })
})

describe('isTimeout', () => {
  it('is true if the input is an Node.js timeout', async () => {
    const promise = new Promise((resolve) => {
      let timeout
      const cb = () => {
        resolve(timeout)
      }
      const ms = 100
      timeout = setTimeout(cb, ms)
      expect(isTimeout(timeout)).toBeTruthy()
    })
    const id = await promise

    expect(isTimeout(id)).toBeTruthy()
    clearTimeout(id)
  })
})
