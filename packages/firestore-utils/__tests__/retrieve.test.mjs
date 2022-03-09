import { deleteAllDocsInCollection } from '../lib/delete.js'
import { docResultsWithId, docResultsWithData } from '../lib/retrieve.js'
import {
  firestoreUserClient,
  firestoreViewerClient,
  FIRESTORE_TEST_COLLECTION
} from './firestore-client.mjs'

describe('docResultsWithId', () => {
  let firestore_user
  let ref

  let firestore_viewer
  let read_only_ref

  beforeAll(async () => {
    firestore_user = firestoreUserClient()
    ref = firestore_user.collection(FIRESTORE_TEST_COLLECTION)

    firestore_viewer = firestoreViewerClient()
    read_only_ref = firestore_viewer.collection(FIRESTORE_TEST_COLLECTION)
  })

  afterAll(async () => {
    await firestore_user.terminate()
    await firestore_viewer.terminate()
  })

  beforeEach(async () => {
    await deleteAllDocsInCollection(ref)
  })

  afterEach(async () => {
    await deleteAllDocsInCollection(ref)
  })

  it('returns all documents with a non-null `id`', async () => {
    const limit = 3

    await ref.doc().create({ id: 123 })
    await ref.doc().create({ id: null })
    await ref.doc().create({ id: 456 })

    const results = await docResultsWithId({ ref: read_only_ref, limit })

    expect(results).toHaveLength(2)
    results.forEach((res) => {
      expect(res).toHaveProperty('id')
      expect(res.id).not.toBeNull()
    })
  })
})

describe('docResultsWithData', () => {
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

  it('returns all documents that match the query (filter: `where()`)', async () => {
    const query = ref.where('some_number', '>=', 2)
    const limit = 10

    await ref.doc().create({ id: 123, some_number: 1 })
    await ref.doc().create({ id: 456, some_number: 2 })
    await ref.doc().create({ id: 789, some_number: 3 })
    await ref.doc().create({ id: null, some_number: 4 })
    await ref.doc().create({ id: 999, some_different_property: 'foo' })

    const results = await docResultsWithData({ query, limit })

    expect(results).toHaveLength(3)
    results.forEach((res) => {
      expect(res).toHaveProperty('data')
      expect(res.data).not.toBeNull()
      expect(res.data).toHaveProperty('some_number')
    })
  })

  it('returns all documents that match the query (filter: `where()` + `orderBy()`)', async () => {
    const query = ref
      .where('some_number', '>=', 2)
      .orderBy('some_number', 'desc')
    const limit = 10

    await ref.doc().create({ id: 123, some_number: 1 })
    await ref.doc().create({ id: 456, some_number: 2 })
    await ref.doc().create({ id: 789, some_number: 3 })
    await ref.doc().create({ id: null, some_number: 4 })
    await ref.doc().create({ id: 999, some_different_property: 'foo' })

    const results = await docResultsWithData({
      query,
      limit
    })

    expect(results).toHaveLength(3)
    expect(results[0].data['some_number']).toBe(4)
    expect(results[2].data['some_number']).toBe(2)
  })
})
