import makeDebug from 'debug'
import type { CollectionReference } from '@google-cloud/firestore'
import { fisherYatesShuffle } from '@jackdbd/utils/array'

const debug = makeDebug('firestore-utils/move')

interface Config {
  ref: CollectionReference
  document_ids: { from: string; to: string }[]
}

/**
 * Move Firestore document **data** from the Firestore document id `from`, to
 * the Firestore document id `to`. In other words, the Firestore document ids do
 * **not** change; it's the document data which is moved from a Firestore
 * document to another.
 *
 * @public
 */
export const moveData = async <D>({ ref, document_ids }: Config) => {
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
 * Shuffle documents in a Firestore collection using the
 * {@link https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle | Fisher-Yates algorithm}.
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
