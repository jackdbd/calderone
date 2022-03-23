import type { Tokens } from '../tokens/interfaces.js'

/**
 * Persistance storage for the tokens.
 *
 * You could persist the tokens on the filesystem, on a vault like GCP Secret
 * Manager, GitHub secrets, etc.
 * https://github.com/marketplace/actions/create-github-secret-action
 */
export interface Store {
  persist: (tokens: Tokens) => Promise<void>
  retrieve: () => Promise<Tokens>
}
