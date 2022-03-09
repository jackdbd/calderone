import fs from 'node:fs'
import path from 'node:path'
import { env } from 'node:process'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { isOnGithub } from '../../checks/lib/environment.js'
import { monorepoRoot } from '../../utils/lib/path.js'

/**
 * Create a Secret Manager client using a service account that has IAM
 * permissions to create/delete secrets and secret versions.
 */
export const secretManagerClient = () => {
  let json
  if (isOnGithub(env)) {
    json = env.SA_SECRET_MANAGER_ADMIN_TEST
  } else {
    const json_path = path.join(
      monorepoRoot(),
      'secrets',
      'sa-secret-manager-admin-test.json'
    )
    json = fs.readFileSync(json_path).toString()
  }

  const { client_email, private_key, project_id } = JSON.parse(json)

  return new SecretManagerServiceClient({
    credentials: { client_email, private_key },
    projectId: project_id
  })
}
