/**
 * @public
 */
export const isError = (x: Error | any): x is Error => {
  // when does err.stack is not defined?
  return (
    (x as Error).name !== undefined && (x as Error).message !== undefined
    // (x as Error).stack !== undefined
  )
}

/**
 * Checks whether the argument passed to this function is a string or not.
 *
 * @public
 */
export const isString = (x: any): x is string => {
  return typeof x === 'string' || x instanceof String
}

/**
 * Checks whether the argument passed to this function is a Node.js timeout or not.
 *
 * @public
 *
 * @see [Timers in Node.js and beyond - Node.js Docs](https://nodejs.org/en/docs/guides/timers-in-node/)
 */
export const isTimeout = (x: any): x is NodeJS.Timeout => {
  return (
    (x as NodeJS.Timeout).refresh !== undefined &&
    (x as NodeJS.Timeout).ref !== undefined &&
    (x as NodeJS.Timeout).unref !== undefined
  )
}
