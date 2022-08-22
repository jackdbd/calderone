import fs from 'node:fs'
import path from 'node:path'
import yargs from 'yargs'
import { UptimeCheckServiceClient } from '@google-cloud/monitoring'
import { monorepoRoot } from '@jackdbd/utils/path'

interface Argv {
  'service-account': string
}

const DEFAULT: Argv = {
  'service-account': 'sa-monitoring.json'
}

interface UptimeChecksConfig {
  client: UptimeCheckServiceClient
  project_id: string
}

const listUptimeChecks = async ({ client, project_id }: UptimeChecksConfig) => {
  const request = {
    parent: client.projectPath(project_id)
  }

  const [uptime_check_configs] = await client.listUptimeCheckConfigs(request)

  uptime_check_configs.forEach((uptimeCheckConfig) => {
    console.log(`ID: ${uptimeCheckConfig.name}`)
    console.log(`  Display Name: ${uptimeCheckConfig.displayName}`)
    console.log('  Resource: %j', uptimeCheckConfig.monitoredResource)
    console.log('  Period: %j', uptimeCheckConfig.period)
    console.log('  Timeout: %j', uptimeCheckConfig.timeout)
    console.log(
      `  Check type: ${(uptimeCheckConfig as any).check_request_type}`
    )
    console.log(
      '  Check: %j',
      uptimeCheckConfig.httpCheck || uptimeCheckConfig.tcpCheck
    )
  })
}

const main = async () => {
  const argv = yargs(process.argv.slice(2)).default(DEFAULT).argv as Argv

  const service_account = argv['service-account']

  const json_key_path = path.join(monorepoRoot(), 'secrets', service_account)
  const obj = JSON.parse(fs.readFileSync(json_key_path).toString())
  const { project_id, client_email, private_key } = obj

  const client = new UptimeCheckServiceClient({
    projectId: project_id,
    credentials: { client_email, private_key }
  })

  await listUptimeChecks({ client, project_id })
}

main()
