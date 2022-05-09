import { readFile } from 'node:fs/promises'
import path from 'node:path'
import makeDebug from 'debug'
import { ErrorReporting } from '@google-cloud/error-reporting'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import {
  isDevelopment,
  isOnCloudRun,
  isOnLocalContainer,
  isProduction,
  isTest
} from '@jackdbd/checks/environment'
import { monorepoRoot } from '@jackdbd/utils/path'

const debug = makeDebug('wasm-news/gcp-clients')

interface Config {
  env: NodeJS.ProcessEnv
  service_name: string
  service_version: string
}
/**
 * Initialize all Google Cloud client libraries used by this application.
 */
export const gcpClients = async ({
  env,
  service_name,
  service_version
}: Config) => {
  let error_reporting: ErrorReporting
  const serviceContext = { service: service_name, version: service_version }

  let debug_agent_config: any
  let secret_manager: SecretManagerServiceClient

  let initialization_method = ''

  if (isOnCloudRun(env)) {
    debug(`detected environment: Cloud Run`)
    // https://cloud.google.com/docs/authentication/production
    initialization_method = `Application Default Credentials (ADC)`

    debug_agent_config = {
      serviceContext: {
        ...serviceContext,
        enableCanary: true
      }
    }

    error_reporting = new ErrorReporting({
      reportMode: 'production',
      serviceContext
    })

    secret_manager = new SecretManagerServiceClient()
  } else if (isOnLocalContainer(env)) {
    debug(`detected environment: container running on my laptop`)
    // SA_JSON_KEY is an environment variable that I use when running the
    // containerized application on my laptop.
    const { client_email, private_key, project_id } = JSON.parse(
      env.SA_JSON_KEY!
    )

    const options = {
      credentials: { client_email, private_key },
      projectId: project_id
    }

    initialization_method = `service account JSON key from environment variable SA_JSON_KEY`

    debug_agent_config = {
      credentials: { client_email, private_key },
      projectId: project_id,
      serviceContext: {
        ...serviceContext,
        enableCanary: true
      }
    }

    error_reporting = new ErrorReporting({
      ...options,
      reportMode: 'always',
      serviceContext
    })

    secret_manager = new SecretManagerServiceClient(options)
  } else if (isDevelopment(env)) {
    debug(`detected environment: Node.js running on my laptop [development]`)
    const filepath = path.join(monorepoRoot(), 'secrets', 'sa-wasm-news.json')
    const str = await readFile(filepath, { encoding: 'utf-8' })
    const { client_email, private_key, project_id } = JSON.parse(str)

    const options = {
      credentials: { client_email, private_key },
      projectId: project_id
    }

    initialization_method = `service account JSON key ${filepath}`

    debug_agent_config = {
      credentials: { client_email, private_key },
      projectId: project_id,
      serviceContext: {
        ...serviceContext,
        enableCanary: true
      }
    }

    error_reporting = new ErrorReporting({
      ...options,
      reportMode: 'always',
      serviceContext
    })

    secret_manager = new SecretManagerServiceClient(options)
  } else if (isTest(env)) {
    debug(`detected environment: Node.js running on my laptop [test]`)
    const filepath = path.join(monorepoRoot(), 'secrets', 'sa-wasm-news.json')
    const str = await readFile(filepath, { encoding: 'utf-8' })
    const { client_email, private_key, project_id } = JSON.parse(str)

    const options = {
      credentials: { client_email, private_key },
      projectId: project_id
    }

    initialization_method = `service account JSON key ${filepath}`

    debug_agent_config = {
      credentials: { client_email, private_key },
      projectId: project_id,
      serviceContext: {
        ...serviceContext,
        enableCanary: true
      }
    }

    error_reporting = new ErrorReporting({
      ...options,
      reportMode: 'always',
      serviceContext
    })

    secret_manager = new SecretManagerServiceClient(options)
  } else {
    const details = [
      `isDevelopment? ${isDevelopment(env)}`,
      `isProduction? ${isProduction(env)}`,
      `isTest? ${isTest(env)}`,
      `isOnCloudRun? ${isOnCloudRun(env)}`,
      `isOnLocalContainer? ${isOnLocalContainer(env)}`,
      `NODE_ENV=${env.NODE_ENV}`,
      `SA_JSON_KEY=${env.SA_JSON_KEY}`
    ]
    throw new Error(
      `cannot initialize GCP client libraries in this environment: ${details.join(
        '; '
      )}`
    )
  }

  debug(`GCP client libraries initialized using ${initialization_method}`)

  return {
    debug_agent_config,
    error_reporting,
    secret_manager
  }
}
