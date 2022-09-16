import { CollectionReference, FieldPath } from '@google-cloud/firestore'
import { partitions } from '@jackdbd/utils/array'

export interface QueriesConfig {
  ref: CollectionReference
  ids: string[]
}

/**
 * Splits an array of Firestore document IDs in chunks of 10, so to comply with
 * Firestore `in`, `not-in`, and `array-contains-any` operators limitations, and
 * returns a list of Firestore queries.
 *
 * @see [Perform simple and compound queries in Cloud Firestore - Firebase docs](https://firebase.google.com/docs/firestore/query-data/queries#in_not-in_and_array-contains-any)
 */
export const queries = ({ ref, ids: all_ids }: QueriesConfig) => {
  return partitions({
    arr: all_ids,
    // In Firestore, the `in`, `not-in`, and `array-contains-any` operators
    // support up to 10 clauses.
    size: 10,
    include_remainder: true
  }).map((ids) => {
    return ref.where(FieldPath.documentId(), 'in', ids)
  })
}
