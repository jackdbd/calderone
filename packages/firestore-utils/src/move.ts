import makeDebug from 'debug'
import type { CollectionReference, Query } from '@google-cloud/firestore'
import { fisherYatesShuffle } from '@jackdbd/utils/array'

const debug = makeDebug('firestore-utils/move')

/**
 * @public
 */
export interface MoveDataConfig {
  ref: CollectionReference
  document_ids: { from: string; to: string }[]
}

/**
 * Moves Firestore document **data** from the Firestore document id `from`, to
 * the Firestore document id `to`.
 *
 * @remarks The Firestore document ids do **not** change; it's the document data
 * which is moved from a Firestore document to another.
 *
 * @public
 */
export const moveData = async <D>({ ref, document_ids }: MoveDataConfig) => {
  const read_promises = document_ids.map(async ({ from, to }) => {
    const doc_ref_from = ref.firestore.collection(ref.path).doc(from)
    const doc_from = await doc_ref_from.get()
    return {
      doc_ref: ref.firestore.collection(ref.path).doc(to),
      data: doc_from.data() as D,
      from,
      to
    }
  })

  ref.firestore.runTransaction(async (t) => {
    const reads = await Promise.all(read_promises)
    reads.forEach(({ doc_ref, data, from, to }) => {
      t.set(doc_ref, data)
      debug(`doc data %O moved in ${ref.path}: ${from} => ${to}`, data)
    })
  })
}

/**
 * Shuffles documents in a Firestore collection using the Fisher-Yates algorithm.
 *
 * @see [Fisher-Yates shuffle - Wikipedia](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
 *
 * @public
 */
export const shuffleWithFisherYates = async (ref: CollectionReference) => {
  const doc_ids: string[] = []
  const qs = await ref.get()
  qs.forEach((doc) => {
    if (doc.exists) {
      doc_ids.push(doc.id)
    }
  })

  const shuffled_ids = [...doc_ids]
  fisherYatesShuffle(shuffled_ids)

  const document_ids = doc_ids.map((from, i) => {
    return { from, to: shuffled_ids[i] }
  })

  await moveData({ ref, document_ids })
  debug(
    `${document_ids.length} documents shuffled in ${ref.path} %O`,
    document_ids
  )
}

/**
 * @public
 */
export interface BulkMoveConfig {
  dest_collection: string
  moved_by?: string
  query: Query
}

/**
 * Moves all Firestore documents matching the provided `query` to a Firestore
 * collection `dest_collection`.
 *
 * This is a Firestore transaction. Either all documents are moved, or none is.
 *
 * @public
 */
export const bulkMove = async ({
  dest_collection,
  moved_by,
  query
}: BulkMoveConfig) => {
  debug(`move Firestore docs matching query to collection '${dest_collection}'`)

  const doc_ids = {
    moved: [] as { src: string; dest: string }[],
    skipped: [] as string[]
  }

  const dest_ref = query.firestore.collection(dest_collection)
  const batch = query.firestore.batch()
  const qs = await query.get()

  qs.forEach((src_doc) => {
    const dest_doc_ref = dest_ref.doc()

    if (src_doc.exists) {
      const data = moved_by
        ? {
            ...src_doc.data(),
            moved_by
          }
        : src_doc.data()

      batch.set(dest_doc_ref, data)
      doc_ids.moved.push({ src: src_doc.id, dest: dest_doc_ref.id })
      batch.delete(src_doc.ref, { exists: true })
    } else {
      doc_ids.skipped.push(src_doc.id)
    }
  })

  await batch.commit()

  const summary = `bulk move committed on a batch of ${qs.size} Firestore documents`
  const details = [
    `${doc_ids.moved.length} documents moved to collection '${dest_collection}'`,
    `${doc_ids.skipped.length} documents could not be moved because they didn't exist`
  ]
  const message = `${summary}: ${details.join('; ')}`

  return { doc_ids, message }
}
