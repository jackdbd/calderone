import { globby } from 'globby'
import makeDebug from 'debug'
import {
  scriptTagsContents,
  styleTagsContents,
  inlineEventHandlerContents,
  inlineStyleContents
} from './html-parsers.js'
import { contentHash, hashAlgorithmFromCspSourceValues } from './utils.js'

const debug = makeDebug('csp/hash')

export type DirectiveKey =
  | 'script-src'
  | 'script-src-attr'
  | 'script-src-elem'
  | 'style-src'
  | 'style-src-attr'
  | 'style-src-elem'

export type CspSources = string[]

export type HashAlgorithmMapConfig = {
  [key in DirectiveKey]: string | undefined
}

/**
 * Detects the hash algorithm to use for all CSP source values in a CSP directive.
 * Different directives might use different hash algorithms.
 */
export const hashAlgorithmMap = (config: {
  [k: string]: CspSources | undefined
}) => {
  const m: HashAlgorithmMapConfig = {
    'script-src': undefined,
    'script-src-attr': undefined,
    'script-src-elem': undefined,
    'style-src': undefined,
    'style-src-attr': undefined,
    'style-src-elem': undefined
  }
  const errors: any[] = []

  const directives = Object.keys(m) as DirectiveKey[]

  directives.forEach((directive) => {
    const sources = config[directive]
    if (sources) {
      debug(
        `CSP directive ${directive} specifies ${sources.length} CSP source value/s: %o`,
        sources
      )
      const { value, error } = hashAlgorithmFromCspSourceValues(sources)
      if (error) {
        errors.push(error)
      }
      if (value) {
        m[directive] = value
      }
    }
  })

  if (errors.length > 0) {
    const message = [
      `could not figure out which hash algorithms to use in Content-Security-Policy directives`,
      ...errors.map((err) => err.message)
    ].join('; ')
    throw new Error(message)
  }

  return m
}

export enum Algorithm {
  sha256 = 'sha256',
  sha384 = 'sha384',
  sha512 = 'sha512'
}

interface Config {
  algorithm: Algorithm
  patterns: string[]
}

interface UniqueHashesConfig extends Config {
  parser: typeof scriptTagsContents | typeof styleTagsContents
}

/**
 * @internal
 */
export const uniqueHashes = async ({
  algorithm,
  parser,
  patterns
}: UniqueHashesConfig) => {
  const paths = await globby(patterns)

  debug(
    `Found ${paths.length} HTML ${
      paths.length === 1 ? 'file' : 'files'
    } matching these glob patterns %O`,
    patterns
  )

  const promises = paths.map(async (filepath) => {
    const contents: string[] = await parser(filepath)
    return contents.map((content) => contentHash({ algorithm, content }))
  })

  // unflattened, with duplicates
  const hashes = await Promise.all(promises)
  // flattened, without duplicates and empty hashes
  const hashesUnique = [...new Set(...hashes.filter((hash) => hash.length > 0))]

  debug(
    `${hashesUnique.length} ${
      hashesUnique.length === 1 ? `hash` : `unique hashes`
    } computed from inlined content (across all pages).`
  )

  return hashesUnique
}

/**
 * @internal
 */
export const hashesScriptSrcAttr = async ({ algorithm, patterns }: Config) => {
  return await uniqueHashes({
    algorithm,
    parser: inlineEventHandlerContents,
    patterns
  })
}

/**
 * @internal
 */
export const hashesScriptSrcElem = async ({ algorithm, patterns }: Config) => {
  return await uniqueHashes({
    algorithm,
    parser: scriptTagsContents,
    patterns
  })
}

/**
 * @internal
 */
export const hashesStyleSrcAttr = async ({ algorithm, patterns }: Config) => {
  return await uniqueHashes({
    algorithm,
    parser: inlineStyleContents,
    patterns
  })
}

/**
 * @internal
 */
export const hashesStyleSrcElem = async ({ algorithm, patterns }: Config) => {
  return await uniqueHashes({
    algorithm,
    parser: styleTagsContents,
    patterns
  })
}

/**
 * @internal
 */
export const noHashSpecifiedMessage = (directive: string) =>
  `CSP directive ${directive}: no hash algorithm specified. No hash will be generated. Return original CSP source values.`
