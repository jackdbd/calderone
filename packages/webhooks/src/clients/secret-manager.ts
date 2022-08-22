import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

export const secretManager = () => {
  let client: SecretManagerServiceClient
  let credentials_retrieved_from = ''

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    credentials_retrieved_from =
      'environment variable GOOGLE_APPLICATION_CREDENTIALS'

    const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS

    client = new SecretManagerServiceClient({ keyFilename })
  } else if (process.env.SA_JSON_KEY) {
    const { client_email, private_key, project_id } = JSON.parse(
      process.env.SA_JSON_KEY
    )

    credentials_retrieved_from = 'environment variable SA_JSON_KEY'

    client = new SecretManagerServiceClient({
      credentials: { client_email, private_key },
      projectId: project_id
    })
  } else {
    credentials_retrieved_from = `Application Default Credentials (ADC)`
    client = new SecretManagerServiceClient()
  }

  const message = `credentials for Secret Manager retrieved from ${credentials_retrieved_from}`

  return { client, message }
}
