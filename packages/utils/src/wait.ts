/**
 * Factory function that creates a promise-returning function that waits `ms`
 * milliseconds and do nothing (useful for example for delaying an HTTP request
 * to an API).
 */
export const makeWaitMs = (ms: number) => {
  return async function waitMs(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`finished waiting ${ms}ms`)
      }, ms)
    })
  }
}

/**
 * Waits 1 second and does nothing.
 */
export const wait1000Ms = makeWaitMs(1000)
