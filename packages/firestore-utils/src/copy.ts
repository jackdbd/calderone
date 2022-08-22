import makeDebug from 'debug'
import type { Query } from '@google-cloud/firestore'

const debug = makeDebug('firestore-utils/copy')

/**
 * @public
 */
export interface BulkCopyConfig {
  copied_by?: string
  dest_collection: string
  query: Query
}

/**
 * Copies all Firestore documents matching the provided `query` to a Firestore
 * collection `dest_collection`.
 *
 * This is a Firestore transaction. Either all documents are copied, or none is.
 *
 * @public
 */
export const bulkCopy = async ({
  copied_by,
  dest_collection,
  query
}: BulkCopyConfig) => {
  debug(`copy Firestore docs matching query to collection '${dest_collection}'`)

  const doc_ids = {
    copied: [] as string[],
    skipped: [] as string[]
  }

  const dest_ref = query.firestore.collection(dest_collection)
  const batch = query.firestore.batch()
  const qs = await query.get()

  qs.forEach((src_doc) => {
    if (src_doc.exists) {
      const data = copied_by
        ? {
            ...src_doc.data(),
            copied_by
          }
        : src_doc.data()

      batch.set(dest_ref.doc(), data)
      doc_ids.copied.push(src_doc.id)
    } else {
      doc_ids.skipped.push(src_doc.id)
    }
  })

  await batch.commit()

  const summary = `bulk copy committed on a batch of ${qs.size} Firestore documents`
  const details = [
    `${doc_ids.copied.length} documents copied to collection '${dest_collection}'`,
    `${doc_ids.skipped.length} documents could not be copied because they didn't exist`
  ]
  const message = `${summary}: ${details.join('; ')}`

  return { doc_ids, message }
}
