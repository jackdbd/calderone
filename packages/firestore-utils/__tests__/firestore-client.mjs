import { env } from 'node:process'
import { Firestore } from '@google-cloud/firestore'

export const FIRESTORE_TEST_COLLECTION = 'test-collection'

export const firestoreViewerClient = () => {
  const json = env.SA_FIRESTORE_VIEWER_TEST
  const { client_email, private_key, project_id } = JSON.parse(json)

  return new Firestore({
    credentials: { client_email, private_key },
    projectId: project_id
  })
}

export const firestoreUserClient = () => {
  const json = env.SA_FIRESTORE_USER_TEST
  const { client_email, private_key, project_id } = JSON.parse(json)

  return new Firestore({
    credentials: { client_email, private_key },
    projectId: project_id
  })
}
