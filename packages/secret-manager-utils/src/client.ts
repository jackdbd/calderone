import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

const clientOptionsFromJSONString = (env_key: string) => {
  const str = process.env[env_key]

  if (str) {
    const obj = JSON.parse(str)
    return {
      credentials: {
        client_email: obj.client_email as string,
        private_key: obj.private_key as string
      },
      projectId: obj.project_id as string
    }
  } else {
    return undefined
  }
}

export interface Options {
  env_key_json_string?: string
}

const DEFAULT_OPTIONS: Required<Options> = {
  env_key_json_string: 'SA_JSON_KEY'
}

/**
 * Initializes the Secret Manager client from the environment.
 */
export const secretManager = (options: Options = DEFAULT_OPTIONS) => {
  const details: string[] = []

  if (process.env.CLOUD_RUN_JOB) {
    return new SecretManagerServiceClient()
  } else {
    details.push(`process.env.CLOUD_RUN_JOB not set`)
  }

  if (process.env.FUNCTION_SIGNATURE_TYPE) {
    return new SecretManagerServiceClient()
  } else {
    details.push(`process.env.FUNCTION_SIGNATURE_TYPE not set`)
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new SecretManagerServiceClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    })
  } else {
    details.push(`process.env.GOOGLE_APPLICATION_CREDENTIALS not set`)
  }

  if (process.env.K_SERVICE) {
    return new SecretManagerServiceClient()
  } else {
    details.push(`process.env.K_SERVICE not set`)
  }

  const env_key =
    options && options.env_key_json_string
      ? options.env_key_json_string
      : DEFAULT_OPTIONS.env_key_json_string

  const client_options = clientOptionsFromJSONString(env_key)
  if (client_options) {
    const { credentials, projectId } = client_options
    return new SecretManagerServiceClient({ credentials, projectId })
  } else {
    details.push(`process.env["${env_key}"] not set`)
  }

  const summary = 'Cannot initialize Secret Manager in this environment'
  throw new Error(`${summary}: ${details.join('; ')}`)
}
