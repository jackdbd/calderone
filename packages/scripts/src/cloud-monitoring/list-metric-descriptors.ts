import fs from 'node:fs'
import path from 'node:path'
import yargs from 'yargs'
import { MetricServiceClient, protos } from '@google-cloud/monitoring'
import { monorepoRoot } from '@jackdbd/utils/path'

interface Argv {
  'service-account': string
}

const DEFAULT: Argv = {
  'service-account': 'sa-monitoring.json'
}

interface Config {
  client: MetricServiceClient
  project_id: string
}

/**
 * List of metrics for Cloud Functions.
 *
 * - https://cloud.google.com/monitoring/api/metrics_gcp#gcp-cloudfunctions
 * - https://cloud.google.com/monitoring/api/v3/filters#metric-descriptor-filter
 * - https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.metricDescriptors#MetricDescriptor
 */
const cloudFunctionsDescriptors = async ({ client, project_id }: Config) => {
  const filter = `project = ${project_id} AND metric.type = starts_with("cloudfunctions.googleapis.com")`

  const iterable = client.listMetricDescriptorsAsync({
    filter,
    name: client.projectPath(project_id)
  })

  const descriptors: DescriptorSummary[] = []
  for await (const descriptor of iterable) {
    descriptors.push(descriptorSummary(descriptor))
  }
  return descriptors
}

interface DescriptorSummary {
  kind: string
  type: string
  unit: string
  name: string
  description: string
  display_name: string
  launch_stage: string
}

const descriptorSummary = (
  descriptor: protos.google.api.IMetricDescriptor
): DescriptorSummary => {
  const {
    description,
    displayName,
    launchStage,
    metricKind,
    name,
    unit,
    valueType
  } = descriptor

  return {
    kind: metricKind! as string,
    type: valueType! as string,
    name: name!,
    unit: unit!,
    description: description!,
    display_name: displayName!,
    launch_stage: launchStage! as string
  }
}

const cloudWorkflowsDescriptors = async ({ client, project_id }: Config) => {
  const filter = `project = ${project_id} AND metric.type = starts_with("workflows.googleapis.com")`
  const iterable = client.listMetricDescriptorsAsync({
    filter,
    name: client.projectPath(project_id)
  })

  const descriptors: DescriptorSummary[] = []
  for await (const descriptor of iterable) {
    descriptors.push(descriptorSummary(descriptor))
  }
  return descriptors
}

// group, metadata, metric, project, resource

/**
 * List of metrics for Cloud Run.
 *
 * - https://cloud.google.com/monitoring/api/metrics_gcp#gcp-run
 * - https://cloud.google.com/monitoring/api/v3/filters#metric-descriptor-filter
 * - https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.metricDescriptors#MetricDescriptor
 */
const cloudRunRevisionDescriptors = async ({ client, project_id }: Config) => {
  const filter = `project = ${project_id} AND metric.type = starts_with("run.googleapis.com")`

  const iterable = client.listMetricDescriptorsAsync({
    filter,
    name: client.projectPath(project_id)
  })

  const descriptors: DescriptorSummary[] = []
  for await (const descriptor of iterable) {
    descriptors.push(descriptorSummary(descriptor))
  }
  return descriptors
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

  const cloud_run_revision_descriptors = await cloudRunRevisionDescriptors({
    client,
    project_id
  })
  console.log(
    `${cloud_run_revision_descriptors.length} Cloud Run revision descriptors`,
    cloud_run_revision_descriptors
  )

  const cloud_functions_descriptors = await cloudFunctionsDescriptors({
    client,
    project_id
  })
  console.log(
    `${cloud_functions_descriptors.length} Cloud Functions descriptors`,
    cloud_functions_descriptors
  )

  const workflow_descriptors = await cloudWorkflowsDescriptors({
    client,
    project_id
  })
  console.log(
    `${workflow_descriptors.length} Workflow descriptors`,
    workflow_descriptors
  )
}

main()
