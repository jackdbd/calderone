import makeDebug from 'debug'
import type { CollectionReference, Query } from '@google-cloud/firestore'

const debug = makeDebug('firestore-utils/retrieve')

/**
 * @public
 */
export interface DocResultsRefConfig {
  limit: number
  ref: CollectionReference
}

/**
 * @public
 */
export interface DocResultId {
  doc_id: string
  id: string
}

/**
 * @public
 */
export interface DocResultsQueryConfig {
  limit: number
  query: Query
}

/**
 * @public
 */
export interface DocResultData<D> {
  doc_id: string
  data: D
}

/**
 * Retrieves all Firestore documents where the **document data** `id` is not null.
 *
 * Returns an array of results where each element contains the Firestore document
 * id `doc_id` and the document data id `id`.
 *
 * @public
 */
export const docResultsWithId = async ({ limit, ref }: DocResultsRefConfig) => {
  const query = ref.where('id', '!=', null)
  const qs = await query.limit(limit).get()
  debug(`retrieve ${qs.size} documents from Firestore collection ${ref.path}`)

  const results: DocResultId[] = []
  if (!qs.empty) {
    qs.forEach((doc) => {
      if (doc.exists) {
        const d = { doc_id: doc.id, id: doc.get('id') }
        debug(`doc.id ${d.doc_id}; data.id ${d.id}`)
        results.push(d)
      } else {
        debug(`doc ${doc.id} does not exist`)
      }
    })
  }
  return results
}

/**
 * Retrieves all Firestore documents that match the given `query`.
 * Return an array of results where each element contains the Firestore document
 * id `doc_id` and the document data `data`.
 *
 * @remarks Firestore does not support inequality filters on multiple properties.
 *
 * @see [Firestore error: Cannot use multiple conditional where clauses on different properties - Stack Overflow](https://stackoverflow.com/questions/65391713/firestore-error-cannot-use-multiple-conditional-where-clauses-on-different-prop?rq=1)
 *
 * @public
 */
export const docResultsWithData = async <D>({
  limit,
  query
}: DocResultsQueryConfig) => {
  const qs = await query.limit(limit).get()
  debug(`retrieve ${qs.size} documents from Firestore`)

  const results: DocResultData<D>[] = []
  if (!qs.empty) {
    qs.forEach((doc) => {
      if (doc.exists) {
        const d = { doc_id: doc.id, data: doc.data() as D }
        debug(`doc.id ${d.doc_id}; doc.data %O`, d.data)
        results.push(d)
      } else {
        debug(`doc ${doc.id} does not exist`)
      }
    })
  }
  return results
}
