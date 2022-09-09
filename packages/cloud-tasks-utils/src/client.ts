import { CloudTasksClient } from '@google-cloud/tasks'

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
 * Initializes the Cloud Tasks client from the environment.
 */
export const cloudTasks = (options: Options = DEFAULT_OPTIONS) => {
  const details: string[] = []

  if (process.env.CLOUD_RUN_JOB) {
    return new CloudTasksClient()
  } else {
    details.push(`process.env.CLOUD_RUN_JOB not set`)
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new CloudTasksClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    })
  } else {
    details.push(`process.env.GOOGLE_APPLICATION_CREDENTIALS not set`)
  }

  const env_key =
    options && options.env_key_json_string
      ? options.env_key_json_string
      : DEFAULT_OPTIONS.env_key_json_string

  const client_options = clientOptionsFromJSONString(env_key)
  if (client_options) {
    const { credentials, projectId } = client_options
    return new CloudTasksClient({ credentials, projectId })
  } else {
    details.push(`process.env["${env_key}"] not set`)
  }

  const summary = 'Cannot initialize Cloud Tasks in this environment'
  throw new Error(`${summary}: ${details.join('; ')}`)
}