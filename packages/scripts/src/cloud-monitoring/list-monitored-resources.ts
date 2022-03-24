import { env } from 'node:process'
import yargs from 'yargs'
import { MetricServiceClient } from '@google-cloud/monitoring'

const DEFAULT = {
  'project-id': env.GCP_PROJECT_ID
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
  const argv = yargs(process.argv.slice(2)).default(DEFAULT).argv

  const project_id = argv['project-id']
  if (!project_id) {
    throw new Error(`--project-id not set`)
  }

  const client = new MetricServiceClient({ projectId: project_id })

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
