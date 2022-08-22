import {
  bulkDelete,
  deleteAllDocsInCollection,
  deleteDocsMatchingQuery
} from '../lib/delete.js'
import {
  firestoreUserClient,
  FIRESTORE_TEST_COLLECTION
} from './firestore-client.mjs'

describe('bulkDelete', () => {
  const firestore = firestoreUserClient()

  afterAll(async () => {
    await firestore.terminate()
  })

  it('deletes all documents in a collection when query is a Firestore collection reference', async () => {
    const coll_ref = firestore.collection(FIRESTORE_TEST_COLLECTION)
    const result_before = await bulkDelete({ query: coll_ref })
    expect(result_before.doc_ids.deleted).toHaveLength(0)

    await coll_ref.doc().create({ foo: 'bar', n: 1 })
    await coll_ref.doc().create({ something: 'good', n: 2 })

    const qs_after_insert = await firestore
      .collection(FIRESTORE_TEST_COLLECTION)
      .get()
    expect(qs_after_insert.size).toBe(2)

    const result_after = await bulkDelete({ query: coll_ref })
    expect(result_after.doc_ids.deleted).toHaveLength(2)

    const qs_after_delete = await firestore
      .collection(FIRESTORE_TEST_COLLECTION)
      .get()
    expect(qs_after_delete.size).toBe(0)
  })

  it('deletes only the documents that match the query', async () => {
    const coll_ref = firestore.collection(FIRESTORE_TEST_COLLECTION)
    await deleteAllDocsInCollection(coll_ref)

    await coll_ref.doc().create({ n: 1 })
    await coll_ref.doc().create({ n: 2 })
    await coll_ref.doc().create({ n: 3 })

    const query = coll_ref.where('n', '>=', 2)
    const { doc_ids } = await bulkDelete({ query })
    expect(doc_ids.deleted).toHaveLength(2)

    const qs_after_delete = await firestore
      .collection(FIRESTORE_TEST_COLLECTION)
      .get()
    expect(qs_after_delete.size).toBe(1)

    await deleteAllDocsInCollection(coll_ref)
  })
})

describe('deleteDocsMatchingQuery', () => {
  let firestore
  let ref

  beforeAll(async () => {
    firestore = firestoreUserClient()
    ref = firestore.collection(FIRESTORE_TEST_COLLECTION)
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
