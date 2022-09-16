import makeDebug from 'debug'

const debug = makeDebug('utils/array')

/**
 * Array of numbers starting from `start` and progressing up to, but not
 * including, `stop`.
 *
 * @public
 *
 * @param start - The lower boundary of the array (included)
 * @param stop - The upper boundary of the array (excluded)
 * @returns An array starting from `start`, incrementing with a `step`, and
 * going to a maximum of `stop-1`
 */
export const range = (start: number, stop: number, step = 1) => {
  debug('start %d stop %d step %d', start, stop, step)
  return Array<number>(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step)
}

/**
 * Shuffles an `array` in place.
 *
 * @public
 *
 * @see [How to randomize (shuffle) a JavaScript array? - Stack Overflow](https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/2450976#2450976)
 */
export const fisherYatesShuffle = <T>(array: T[]) => {
  debug('original %O', array)
  let j = 0
  let temp: T

  for (let i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  debug('shuffled %O', array)
}

export interface PartitionsConfig<T> {
  arr: T[]
  size: number
  include_remainder?: boolean
}

/**
 * Partitions an array into chunks of equal size. If the last chunk is smaller
 * than the other ones, it is returned only when `include_remainder` is true.
 *
 * @public
 */
export const partitions = <T = any>({
  arr,
  size,
  include_remainder
}: PartitionsConfig<T>) => {
  const chunks: T[][] = []
  for (let start = 0; start < arr.length; start += size) {
    const end = Math.min(start + size - 1, arr.length - 1) + 1
    const chunk = arr.slice(start, end)
    debug(`chunk [${start}; ${end})`)

    if (chunk.length < size) {
      if (include_remainder) {
        chunks.push(chunk)
      } else {
        debug(
          `chunk [${start}; ${end}) excluded because has size ${chunk.length} < ${size}. If you want to include it, set include_remainder to true.`
        )
      }
    } else {
      chunks.push(chunk)
    }
  }
  return chunks
}
