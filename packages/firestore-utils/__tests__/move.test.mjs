import { deleteAllDocsInCollection } from '../lib/delete.js'
import { moveData } from '../lib/move.js'
import {
  firestoreUserClient,
  FIRESTORE_TEST_COLLECTION
} from './firestore-client.mjs'

const timeout_ms = 10000

describe('moveData', () => {
  const firestore = firestoreUserClient()
  const collection = `${FIRESTORE_TEST_COLLECTION}_moveData`
  const ref = firestore.collection(collection)

  afterAll(async () => {
    await deleteAllDocsInCollection(ref)
    await firestore.terminate()
  }, timeout_ms)

  beforeEach(async () => {
    await deleteAllDocsInCollection(ref)
  }, timeout_ms)

  it(
    'move data between 2 documents without altering their id',
    async () => {
      const ref = firestore.collection(collection)

      await ref.doc().create({ some_number: 1, some_string: 'aaa' })
      await ref.doc().create({ some_number: 2, some_string: 'bbb' })
      await ref.doc().create({ some_number: 3, some_string: 'ccc' })

      const qs_before = await ref.get()

      const docs = qs_before.docs.map((d) => {
        return { from: d.id, to: 'tmp', data: d.data() }
      })

      const documents = docs.map((doc, i) => {
        // swap data in document 0 with data in document 2
        switch (i) {
          case 0:
            return { ...doc, to: docs[2].from }
          case 2:
            return { ...doc, to: docs[0].from }
          default:
            return { ...doc, to: doc.from }
        }
      })

      const document_ids = documents.map((d) => ({ from: d.from, to: d.to }))
      await moveData({ ref, document_ids })

      const qs_after = await ref.get()
      expect(qs_after.docs.length).toBe(qs_before.docs.length)

      const docZeroAfter = {
        id: qs_after.docs[0].id,
        data: qs_after.docs[0].data()
      }

      const docOneAfter = {
        id: qs_after.docs[1].id,
        data: qs_after.docs[1].data()
      }

      const docTwoAfter = {
        id: qs_after.docs[2].id,
        data: qs_after.docs[2].data()
      }

      expect(docZeroAfter.id).toBe(documents[0].from)
      expect(docOneAfter.id).toBe(documents[1].from)
      expect(docTwoAfter.id).toBe(documents[2].from)

      // TODO: fix this test
      // doc data swapped in docs 0/2. 1 is left untouched.
      // expect(docZeroAfter.data).toMatchObject(documents[2].data)
      expect(docOneAfter.data).toMatchObject(documents[1].data)
      // expect(docTwoAfter.data).toMatchObject(documents[0].data)
    },
    timeout_ms
  )
})
