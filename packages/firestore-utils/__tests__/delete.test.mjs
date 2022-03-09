import {
  deleteAllDocsInCollection,
  deleteDocsMatchingQuery
} from '../lib/delete.js'
import {
  firestoreUserClient,
  firestoreViewerClient,
  FIRESTORE_TEST_COLLECTION
} from './firestore-client.mjs'

describe('deleteAllDocsInCollection', () => {
  const firestore = firestoreUserClient()
  const ref = firestore.collection(FIRESTORE_TEST_COLLECTION)

  afterAll(async () => {
    await firestore.terminate()
  })

  beforeEach(async () => {
    await deleteAllDocsInCollection(ref)
  })

  it('deletes all documents in a collection', async () => {
    await ref.doc().create({ foo: 'bar' })
    await ref.doc().create({ something: 'good' })
    const docs_before = await firestore
      .collection(FIRESTORE_TEST_COLLECTION)
      .listDocuments()
    expect(docs_before).toHaveLength(2)

    await deleteAllDocsInCollection(ref)

    const docs_after = await firestore
      .collection(FIRESTORE_TEST_COLLECTION)
      .listDocuments()
    expect(docs_after).toHaveLength(0)
  })
})

describe('deleteDocsMatchingQuery', () => {
  let firestore
  let ref

  beforeAll(async () => {
    firestore = new Firestore()
    const collection = FIRESTORE_COLLECTION.TestEvents
    ref = firestore.collection(collection)
  })

  afterAll(async () => {
    await firestore.terminate()
  })

  beforeEach(async () => {
    await deleteAllDocsInCollection(ref)
  })

  afterEach(async () => {
    await deleteAllDocsInCollection(ref)
  })

  it('deletes all documents matching `query`', async () => {
    await ref.doc().create({ some_number: 1 })
    await ref.doc().create({ some_number: 2 })
    await ref.doc().create({ some_number: 3 })
    await ref.doc().create({ some_number: 4 })
    const query = ref.where('some_number', '>=', 2)

    const message = await deleteDocsMatchingQuery(query)

    expect(message).toBe('deleted 3 documents')
  })
})
