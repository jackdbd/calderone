import { env } from 'node:process'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

/**
 * Create a Secret Manager client using a service account that has IAM
 * permissions to create/delete secrets and secret versions.
 */
export const secretManagerClient = () => {
  const json = env.SA_SECRET_MANAGER_ADMIN_TEST
  const { client_email, private_key, project_id } = JSON.parse(json)

  return new SecretManagerServiceClient({
    credentials: { client_email, private_key },
    projectId: project_id
  })
}
