import { arch, pid, release, versions } from 'node:process'
import { readFile } from 'node:fs/promises'
import makeDebug from 'debug'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import {
  isOnCloudRun,
  isDevelopment,
  isOnLocalContainer,
  isProduction,
  isTest
} from '@jackdbd/checks/environment'
import { accessSecretVersion } from '@jackdbd/secret-manager-utils'
import { gcpClients } from './gcp-clients.js'
import { testerIps } from './routes/webpagetest/utils.js'

const debug = makeDebug('webhooks/config')

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

  const { debug_agent_config, error_reporting, firestore, secret_manager } =
    await gcpClients({
      env,
      service_name,
      service_version
    })

  // how do I get this programmatically?
  const region_id = 'europe-west3'

  const project_id = await secret_manager.getProjectId()

  const [
    json_google_sheets,
    json_netlify,
    json_sendgrid,
    json_sa_webperf,
    json_telegram
  ] = await Promise.all([
    accessSecretVersion({
      secret_manager,
      secret_name: 'GOOGLE_SHEETS',
      version: 'latest'
    }),
    accessSecretVersion({
      secret_manager,
      secret_name: 'NETLIFY',
      version: 'latest'
    }),
    accessSecretVersion({
      secret_manager,
      secret_name: 'SENDGRID',
      version: 'latest'
    }),
    accessSecretVersion({
      secret_manager,
      secret_name: 'service-account_webperf-audit_json',
      version: 'latest'
    }),
    accessSecretVersion({
      secret_manager,
      secret_name: 'TELEGRAM',
      version: 'latest'
    })
  ])

  const { performance_audit: sheet_id } = JSON.parse(json_google_sheets)

  const doc = new GoogleSpreadsheet(sheet_id)

  const { client_email, private_key } = JSON.parse(json_sa_webperf)
  await doc.useServiceAccountAuth({ client_email, private_key })
  await doc.loadInfo()

  const { site_id, site_name } = JSON.parse(json_netlify)

  const { api_key: sendgrid_api_key } = JSON.parse(json_sendgrid)

  const { chat_id: telegram_chat_id, token: telegram_token } =
    JSON.parse(json_telegram)

  const webpagetest_tester_ips = await testerIps()

  return {
    cloud_run_logs_href: `https://console.cloud.google.com/run/detail/${region_id}/${service_id}/logs?project=${project_id}`,
    debug_agent_config,
    doc,
    environment,
    error_reporting,
    firestore,
    netlify_site: {
      id: site_id,
      name: site_name,
      url: 'https://giacomodebidda.com/'
    },
    port: env.PORT || 8080,
    project_id,
    region_id,
    secret_manager,
    sendgrid_api_key,
    service_id,
    service_name,
    service_version,
    sheet_id,
    telegram_chat_id,
    telegram_token,
    webpagetest_tester_ips
  }
}
