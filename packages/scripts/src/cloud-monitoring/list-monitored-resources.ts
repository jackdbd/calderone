import fs from 'node:fs'
import path from 'node:path'
import yargs from 'yargs'
import { MetricServiceClient } from '@google-cloud/monitoring'
import { monorepoRoot } from '@jackdbd/utils/path'

interface Argv {
  'service-account': string
}

const DEFAULT: Argv = {
  'service-account': 'sa-monitoring.json'
}

interface Config {
  client: MetricServiceClient
  filter: string
  project_id: string
}

/**
 * List of Google Cloud resources that can be monitored.
 *
 * - https://cloud.google.com/monitoring/api/v3/filters#mr-filter
 * - https://cloud.google.com/monitoring/api/resources
 */
const monitoredResourceDescriptors = async ({
  client,
  filter,
  project_id
}: Config) => {
  const iterable = client.listMonitoredResourceDescriptorsAsync({
    filter,
    name: client.projectPath(project_id)
  })

  for await (const descriptor of iterable) {
    console.log(descriptor)
  }
}

const main = async () => {
  const argv = yargs(process.argv.slice(2)).default(DEFAULT).argv as Argv

  const service_account = argv['service-account']

  const json_key_path = path.join(monorepoRoot(), 'secrets', service_account)
  const obj = JSON.parse(fs.readFileSync(json_key_path).toString())
  const { project_id, client_email, private_key } = obj

  const client = new MetricServiceClient({
    projectId: project_id,
    credentials: { client_email, private_key }
  })

  await monitoredResourceDescriptors({
    client,
    filter: `resource.type = starts_with("cloud_run_revision")`,
    project_id
  })

  await monitoredResourceDescriptors({
    client,
    filter: `resource.type = starts_with("workflows.googleapis.com/Workflow")`,
    project_id
  })
}

main()
