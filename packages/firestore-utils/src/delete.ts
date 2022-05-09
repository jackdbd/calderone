import makeDebug from 'debug'
import type { CollectionReference, Query } from '@google-cloud/firestore'

const debug = makeDebug('firestore-utils/delete')

/**
 * Delete all documents in a Firestore collection.
 *
 * This function could be improved to delete batches of `batchSize`. See link.
 * https://firebase.google.com/docs/firestore/manage-data/delete-data#node.js_2
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
