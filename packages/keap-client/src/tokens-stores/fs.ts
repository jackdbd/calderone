import { readFileSync, writeFileSync } from 'node:fs'
import makeDebug from 'debug'
import type { Store } from './interfaces.js'
import type { Tokens } from '../tokens/interfaces.js'

const debug = makeDebug('keap-client/tokens-store/fs')

export const fsStore = (filepath: string): Store => {
  return {
    retrieve: async () => {
      debug(`retrieve tokens from [${filepath}]`)
      return JSON.parse(readFileSync(filepath).toString()) as Tokens
    },
    persist: async (tokens) => {
      debug(
        `persist ${tokens.token_type} tokens with scope ${tokens.scope} at [${filepath}]`
      )
      writeFileSync(filepath, JSON.stringify(tokens, null, 2))
    }
  }
}

/**
 * Tokens store that always fails to persist the tokens. Useful in tests.
 */
export const fsStoreThatCanOnlyRetrieve = (filepath: string): Store => {
  return {
    retrieve: async () => {
      debug(`retrieve tokens from [${filepath}]`)
      return JSON.parse(readFileSync(filepath).toString()) as Tokens
    },
    persist: async (_tokens) => {
      throw new Error('this store cannot persist tokens')
    }
  }
}
