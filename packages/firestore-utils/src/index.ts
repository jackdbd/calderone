/**
 * Utility functions for [Firestore](https://cloud.google.com/firestore).
 *
 * @packageDocumentation
 *
 * @see [Cloud Firestore: Node.js Client - GitHub](https://github.com/googleapis/nodejs-firestore)
 */

export { firestore } from './client.js'
export type { Options as ClientOptions } from './client.js'

export { bulkCopy } from './copy.js'
export type { BulkCopyConfig } from './copy.js'

export {
  bulkDelete,
  deleteAllDocsInCollection,
  deleteDocsMatchingQuery
} from './delete.js'
export type { BulkDeleteConfig } from './delete.js'

export { errorFromFirestore } from './error.js'

export { bulkMove, moveData, shuffleWithFisherYates } from './move.js'
export type { BulkMoveConfig, MoveDataConfig } from './move.js'

export { queries } from './query.js'
export type { QueriesConfig } from './query.js'

export { docResultsWithId, docResultsWithData } from './retrieve.js'

export type {
  DocResultData,
  DocResultsRefConfig,
  DocResultId,
  DocResultsQueryConfig
} from './retrieve.js'
