import { arch, pid, release, versions } from 'node:process'
import { readFile } from 'node:fs/promises'
import makeDebug from 'debug'
import {
  isOnCloudRun,
  isDevelopment,
  isOnLocalContainer,
  isProduction,
  isTest
} from '@jackdbd/checks/environment'
import { accessSecretVersion } from '@jackdbd/secret-manager-utils'
import { gcpClients } from './gcp-clients.js'

const debug = makeDebug('telegram-bot/config')

export const config = async (env: NodeJS.ProcessEnv) => {
  if (!env.NODE_ENV) {
    throw new Error('environment variable NODE_ENV not set')
  }

  if (
    env.NODE_ENV !== 'development' &&
    env.NODE_ENV !== 'production' &&
    env.NODE_ENV !== 'test'
  ) {
    throw new Error(
      `environment variable NODE_ENV must be one of: development, production, test. It was set to ${env.NODE_ENV}`
    )
  }

  const environment = env.NODE_ENV

  debug(`arch: ${arch}`)
  debug(`pid: ${pid}`)
  debug(`release: %O`, release)
  debug(`versions: %O`, versions)
  debug(`env.HOME: ${env.HOME}`)
  debug(`env.HOSTNAME: ${env.HOSTNAME}`)

  debug(`gather config for environment: ${environment}`)

  let package_json_path: string

  if (isOnCloudRun(env)) {
    debug(`detected environment: Cloud Run [${environment}]`)
    package_json_path = 'package.json'
  } else if (isOnLocalContainer(env)) {
    debug(
      `detected environment: container running on my laptop [${environment}]`
    )
    package_json_path = 'package.json'
  } else if (isDevelopment(env)) {
    debug(`detected environment: Node.js running on my laptop [${environment}]`)
    // package_json_path = path.join('dist', 'package.json')
    package_json_path = 'package.json'
  } else if (isTest(env)) {
    debug(`detected environment: Node.js running on my laptop [${environment}]`)
    package_json_path = 'package.json'
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
      `cannot gather config in this environment: ${details.join('; ')}`
    )
  }

  const str = await readFile(package_json_path, { encoding: 'utf-8' })
  const { name, version: service_version } = JSON.parse(str)

  const service_id = `${name.replace('@jackdbd/', '')}-${environment}`
  const service_name = `${name.replace('@jackdbd/', '')} [${environment}]`

  const { debug_agent_config, error_reporting, secret_manager } =
    await gcpClients({
      env,
      service_name,
      service_version
    })

  // how do I get this programmatically?
  const region_id = 'europe-west3'

  const project_id = await secret_manager.getProjectId()

  const [json_telegram] = await Promise.all([
    accessSecretVersion({
      secret_manager,
      secret_name: 'TELEGRAM',
      version: 'latest'
    })
  ])

  const { chat_id: telegram_chat_id, token: telegram_token } =
    JSON.parse(json_telegram)

  return {
    cloud_run_logs_href: `https://console.cloud.google.com/run/detail/${region_id}/${service_id}/logs?project=${project_id}`,
    debug_agent_config,
    environment,
    error_reporting,
    port: env.PORT || 8080,
    project_id,
    region_id,
    secret_manager,
    service_id,
    service_name,
    service_version,
    telegram_chat_id,
    telegram_token
  }
}
