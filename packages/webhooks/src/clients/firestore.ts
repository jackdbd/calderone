import { Firestore } from '@google-cloud/firestore'

export const firestore = () => {
  let client: Firestore
  let credentials_retrieved_from = ''

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    credentials_retrieved_from =
      'environment variable GOOGLE_APPLICATION_CREDENTIALS'

    const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS

    client = new Firestore({ keyFilename })
  } else if (process.env.SA_JSON_KEY) {
    const { client_email, private_key, project_id } = JSON.parse(
      process.env.SA_JSON_KEY
    )

    credentials_retrieved_from = 'environment variable SA_JSON_KEY'

    client = new Firestore({
      credentials: { client_email, private_key },
      projectId: project_id
    })
  } else {
    credentials_retrieved_from = `Application Default Credentials (ADC)`
    client = new Firestore()
  }

  const message = `credentials for Firestore retrieved from ${credentials_retrieved_from}`

  return { client, message }
}
