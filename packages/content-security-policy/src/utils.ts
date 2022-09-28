import crypto from 'node:crypto'
import makeDebug from 'debug'

const debug = makeDebug('csp/utils')

export const isBoolean = (val: any) => typeof val === 'boolean'

export const isObject = (item: any) => {
  return item && typeof item === 'object' && !Array.isArray(item)
}

export const isString = (item: any) => {
  return item && (typeof item === 'string' || item instanceof String)
}

export const mergeDeep = (target: any, ...sources: any[]): any => {
  if (!sources.length) {
    return target
  }
  const source = sources.shift()
  // debug(`merge SOURCE %O into TARGET %O`, source, target)

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key])
          Object.assign(target, {
            [key]: {}
          })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, {
          [key]: source[key]
        })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

// https://bobbyhadz.com/blog/javascript-get-difference-between-two-sets
export function diffBetweenSets(setA: Set<any>, setB: Set<any>) {
  return new Set([...setA].filter((elem) => !setB.has(elem)))
}

export const stringReplacer = (s: string) => {
  if (
    s === 'none' ||
    s === 'report-sample' ||
    s === 'script' ||
    s === 'self' ||
    s === 'strict-dynamic' ||
    s === 'unsafe-eval' ||
    s === 'unsafe-hashes' ||
    s === 'unsafe-inline' ||
    s.startsWith('sha')
  ) {
    return s.replace(s, `'${s}'`)
  } else {
    return s
  }
}

export const hashAlgorithmFromCspSourceValues = (arr: string[]) => {
  const algorithms = arr.filter(
    (s) => s === 'sha256' || s === 'sha384' || s === 'sha512'
  )

  debug(`Hash algorithms found: ${algorithms.join(', ')}`)

  if (algorithms.length === 0) {
    return { value: undefined, error: undefined }
  } else if (algorithms.length === 1) {
    return { value: algorithms[0], error: undefined }
  } else {
    return {
      value: undefined,
      error: new Error(
        `multiple hash algorithms specified (${algorithms.join(', ')})`
      )
    }
  }
}

interface ContentHashConfig {
  algorithm: string
  content: string
}

export const contentHash = ({ algorithm, content }: ContentHashConfig) => {
  debug(`Compute ${algorithm}-hash from a string of length ${content.length}`)
  const hasher = crypto.createHash(algorithm)
  return `${algorithm}-${hasher.update(content, 'utf-8').digest('base64')}`
}
