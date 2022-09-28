import makeDebug from 'debug'
import {
  hashAlgorithmMap,
  noHashSpecifiedMessage,
  hashesScriptSrcElem,
  hashesStyleSrcElem
} from './hash.js'
import type { Algorithm, DirectiveKey } from './hash.js'
import type { Directives } from './directives.js'

const debug = makeDebug('csp/source-values')

interface CspSourceValuesConfigOne {
  algorithm: Algorithm
  hashes: string[]
  values: string[]
}

/**
 * @internal
 */
const cspSourceValues = ({
  algorithm,
  hashes,
  values
}: CspSourceValuesConfigOne) => {
  const i = values.indexOf(algorithm)
  if (i !== -1) {
    debug(`Found ${algorithm} at index ${i}.`)
    return [...values.slice(0, i), ...values.slice(i + 1), ...hashes]
  } else {
    return values
  }
}

interface Config {
  directive: DirectiveKey
  directives: Directives
  patterns: string[]
}

interface AlgorithmConfig {
  directive: DirectiveKey
  directives: Directives
}

const hashAlgorithm = ({ directive, directives }: AlgorithmConfig) => {
  const hash_algo = hashAlgorithmMap(directives)
  return hash_algo[directive] as Algorithm | undefined
}

/**
 * @internal
 */
export const cspSourceValuesScriptAttr = async ({
  directive,
  directives
}: Config) => {
  const algorithm = hashAlgorithm({ directive, directives })

  if (!algorithm) {
    debug(noHashSpecifiedMessage(directive))
    return directives[directive]
  }

  throw new Error(
    `NOT IMPLEMENTED: content hash generation for the ${directive} CSP directive is currently not implemented. Use 'unsafe-hashes' instead.`
  )
}

/**
 * @internal
 */
export const cspSourceValuesScriptElem = async ({
  directive,
  directives,
  patterns
}: Config) => {
  const algorithm = hashAlgorithm({ directive, directives })

  if (!algorithm) {
    debug(
      `CSP directive ${directive}: no has algorithm specified. No hash will be generated. Return original CSP source values.`
    )
    return directives[directive]
  }

  debug(noHashSpecifiedMessage(directive))

  const hashes = await hashesScriptSrcElem({
    algorithm,
    patterns
  })

  debug(`CSP directive ${directive}: allow hashes %O`, hashes)

  return cspSourceValues({
    algorithm,
    hashes,
    values: directives[directive]
  })
}

/**
 * @internal
 */
export const cspSourceValuesStyleAttr = async ({
  directive,
  directives
}: Config) => {
  const algorithm = hashAlgorithm({ directive, directives })

  if (!algorithm) {
    debug(noHashSpecifiedMessage(directive))
    return directives[directive]
  }

  throw new Error(
    `NOT IMPLEMENTED: content hash generation for the ${directive} CSP directive is currently not implemented. Use 'unsafe-inline' instead.`
  )
}

/**
 * @internal
 */
export const cspSourceValuesStyleElem = async ({
  directive,
  directives,
  patterns
}: Config) => {
  const algorithm = hashAlgorithm({ directive, directives })

  if (!algorithm) {
    debug(noHashSpecifiedMessage(directive))
    return directives[directive]
  }

  debug(
    `CSP directive ${directive}: parse HTML and compute ${algorithm} hashes`
  )

  const hashes = await hashesStyleSrcElem({
    algorithm,
    patterns
  })

  debug(`CSP directive ${directive}: allow hashes %O`, hashes)

  return cspSourceValues({
    algorithm,
    hashes,
    values: directives[directive]
  })
}
