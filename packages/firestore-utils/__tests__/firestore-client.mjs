import fs from 'node:fs'
import path from 'node:path'
import { env } from 'node:process'
import { Firestore } from '@google-cloud/firestore'
import { isOnGithub } from '../../checks/lib/environment.js'
import { monorepoRoot } from '../../utils/lib/path.js'

export const FIRESTORE_TEST_COLLECTION = 'test-collection'

export const firestoreViewerClient = () => {
  let json
  if (isOnGithub(env)) {
    json = env.SA_FIRESTORE_VIEWER_TEST
  } else {
    const json_path = path.join(
      monorepoRoot(),
      'secrets',
      'sa-firestore-viewer-test.json'
    )
    json = fs.readFileSync(json_path).toString()
  }

  const { client_email, private_key, project_id } = JSON.parse(json)

  return new Firestore({
    credentials: { client_email, private_key },
    projectId: project_id
  })
}

export const firestoreUserClient = () => {
  let json
  if (isOnGithub(env)) {
    json = env.SA_FIRESTORE_USER_TEST
  } else {
    const json_path = path.join(
      monorepoRoot(),
      'secrets',
      'sa-firestore-user-test.json'
    )
    json = fs.readFileSync(json_path).toString()
  }

  const { client_email, private_key, project_id } = JSON.parse(json)

  return new Firestore({
    credentials: { client_email, private_key },
    projectId: project_id
  })
}
