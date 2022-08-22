import { ErrorReporting } from '@google-cloud/error-reporting'

interface Config {
  cloud_run_service_id: string
  cloud_run_service_version: string
}

export const errorReporting = ({
  cloud_run_service_id,
  cloud_run_service_version
}: Config) => {
  let client: ErrorReporting
  let credentials_retrieved_from = ''

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    credentials_retrieved_from =
      'environment variable GOOGLE_APPLICATION_CREDENTIALS'

    const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS

    client = new ErrorReporting({
      keyFilename,
      logLevel: 4,
      reportMode: 'production',
      serviceContext: {
        service: cloud_run_service_id,
        version: cloud_run_service_version
      }
    })
  } else if (process.env.SA_JSON_KEY) {
    const { client_email, private_key, project_id } = JSON.parse(
      process.env.SA_JSON_KEY
    )

    credentials_retrieved_from = 'environment variable SA_JSON_KEY'

    client = new ErrorReporting({
      credentials: { client_email, private_key },
      projectId: project_id,
      logLevel: 4,
      reportMode: 'production',
      serviceContext: {
        service: cloud_run_service_id,
        version: cloud_run_service_version
      }
    })
  } else {
    credentials_retrieved_from = `Application Default Credentials (ADC)`

    client = new ErrorReporting({
      logLevel: 4,
      reportMode: 'production',
      serviceContext: {
        service: cloud_run_service_id,
        version: cloud_run_service_version
      }
    })
  }

  const message = `credentials for Error Reporting retrieved from ${credentials_retrieved_from}`

  return { client, message }
}
