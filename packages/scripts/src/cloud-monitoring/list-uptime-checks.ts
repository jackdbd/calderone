import { env } from 'node:process'
import yargs from 'yargs'
import { UptimeCheckServiceClient } from '@google-cloud/monitoring'

const DEFAULT = {
  'project-id': env.GCP_PROJECT_ID
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
  const argv = yargs(process.argv.slice(2))
    .boolean(['delete-job'])
    .default(DEFAULT).argv

  const project_id = argv['project-id']
  if (!project_id) {
    throw new Error(`--project-id not set`)
  }

  const client = new UptimeCheckServiceClient({
    projectId: project_id
  })
  await listUptimeChecks({ client, project_id })
}

main()
