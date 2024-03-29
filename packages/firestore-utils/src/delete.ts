import makeDebug from 'debug'
import type { CollectionReference, Query } from '@google-cloud/firestore'

const debug = makeDebug('firestore-utils/delete')

/**
 * Deletes all documents in a Firestore collection.
 *
 * This function could be improved to delete batches of `batchSize`. See {@link https://firebase.google.com/docs/firestore/manage-data/delete-data#node.js_2 | Delete Collections}.
 *
 * @remarks Consider using the more flexible {@link @jackdbd/firestore-utils#bulkDelete} instead.
 *
 * @public
 */
export const deleteAllDocsInCollection = async (ref: CollectionReference) => {
  const qs = await ref.get()

  const batch = ref.firestore.batch()
  debug(
    `delete batch created (ref) in ${ref.path}: ${qs.size} docs to process in batch, ${qs.size} docs in collection`
  )
  let count = 0
  qs.docs.forEach((doc) => {
    batch.delete(doc.ref)
    count += 1
  })
  await batch.commit()

  debug(
    `delete batch committed (ref) in ${ref.path}: ${count} docs processed in batch, ${qs.size} docs in collection`
  )

  return `deleted ${count} documents in collection ${ref.path}`
}

/**
 * Deletes all documents matching a query.
 *
 * @deprecated Use {@link @jackdbd/firestore-utils#bulkDelete} instead.
 * @public
 */
export const deleteDocsMatchingQuery = async (query: Query) => {
  const qs = await query.get()

  const batch = query.firestore.batch()
  debug(`delete batch created (query): ${qs.size} documents in batch`)
  let count = 0
  qs.docs.forEach((doc) => {
    batch.delete(doc.ref)
    count += 1
  })
  await batch.commit()

  const message = `deleted ${count} documents`
  debug(`delete batch committed (query): ${message}`)
  return message
}

/**
 * @public
 */
export interface BulkDeleteConfig {
  query: Query
}

/**
 * Deletes all Firestore documents matching the provided `query`.
 *
 * This is a Firestore transaction. Either all documents are deleted, or none is.
 *
 * @public
 */
export const bulkDelete = async ({ query }: BulkDeleteConfig) => {
  debug(`delete Firestore docs matching query`)

  const doc_ids = {
    deleted: [] as string[],
    skipped: [] as string[]
  }

  const batch = query.firestore.batch()
  const qs = await query.get()

  qs.forEach((doc) => {
    if (doc.exists) {
      batch.delete(doc.ref, { exists: true })
      doc_ids.deleted.push(doc.id)
    } else {
      doc_ids.skipped.push(doc.id)
    }
  })

  await batch.commit()

  const summary = `bulk delete committed on a batch of ${qs.size} Firestore documents`
  const details = [
    `${doc_ids.deleted.length} documents deleted`,
    `${doc_ids.skipped.length} documents could not be deleted because they didn't exist`
  ]
  const message = `${summary}: ${details.join('; ')}`

  return { doc_ids, message }
}
