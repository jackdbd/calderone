import fs from 'node:fs'
import path from 'node:path'
import yargs from 'yargs'
import { monorepoRoot } from '@jackdbd/utils/path'
import { MetricServiceClient, protos } from '@google-cloud/monitoring'

interface Argv {
  'service-account': string
}

const DEFAULT: Argv = {
  'service-account': 'sa-monitoring.json'
}

// filter for time series data
// https://cloud.google.com/monitoring/api/v3/filters#time-series-filter

interface MetricDescriptorConfig {
  client: MetricServiceClient
  project_id: string
  metric_descriptor_id: string
}

const metricDescriptor = async ({
  client,
  project_id,
  metric_descriptor_id
}: MetricDescriptorConfig) => {
  const request = {
    name: client.projectMetricDescriptorPath(project_id, metric_descriptor_id)
  }

  const [descriptor] = await client.getMetricDescriptor(request)

  const { description, displayName, metricKind, name, unit, valueType } =
    descriptor

  return {
    id: name,
    name: displayName,
    unit,
    kind: metricKind,
    type: valueType,
    description
  }
}

interface TimeSeriesConfig {
  client: MetricServiceClient
  project_id: string
  t_start: number
  t_stop: number
}

const datapoint = (point: protos.google.monitoring.v3.IPoint) => {
  let t0: any
  let t1: any
  if (point.interval) {
    if (point.interval.startTime) {
      t0 = point.interval.startTime.seconds
    }
    if (point.interval.endTime) {
      t1 = point.interval.endTime.seconds
    }
  }

  if (point.value) {
    switch ((point.value as any).value) {
      case 'distributionValue': {
        const { mean } = point.value.distributionValue!
        return { value: mean, t0, t1 }
      }
      case 'doubleValue': {
        const value = point.value.doubleValue!
        return { value, t0, t1 }
      }
      default: {
        throw new Error(
          `point.value not handled: ${JSON.stringify(point.value)}`
        )
      }
    }
  }

  throw new Error(`point not handled: ${JSON.stringify(point)}`)
}

const cloudRunBillableInstanceTime = async ({
  client,
  project_id,
  t_start,
  t_stop
}: TimeSeriesConfig) => {
  const metric_descriptor_id =
    'run.googleapis.com/container/billable_instance_time'

  const filter = `metric.type = "${metric_descriptor_id}"`

  const { name, unit, kind, type, description } = await metricDescriptor({
    client,
    metric_descriptor_id,
    project_id
  })

  const request = {
    name: client.projectPath(project_id),
    filter,
    interval: {
      startTime: {
        seconds: t_start
      },
      endTime: {
        seconds: t_stop
      }
    }
  }

  const [timeSeries] = await client.listTimeSeries(request)

  const d_start = new Date(t_start * 1000)
  const d_stop = new Date(t_stop * 1000)

  timeSeries.forEach((data, i) => {
    if (data.resource && data.resource.labels) {
      const service_name = data.resource.labels.service_name
      console.log(
        `[${i}] ${name} for Cloud Run service ${service_name} from ${d_start.toISOString()} to ${d_stop.toISOString()}`
      )
      console.log(`unit: ${unit} ${kind} ${type}`)
      console.log(description)
    }

    if (data.points) {
      data.points.forEach((point) => {
        const d = datapoint(point)
        console.log(d)
      })
    }
  })
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

  const t_stop = new Date().getTime() / 1000
  const t_start = t_stop - 3600 * 24 * 7 // one week ago
  //   const t_start = t_stop - 3600 * 24 * 30 // 30 days ago

  await cloudRunBillableInstanceTime({ client, project_id, t_start, t_stop })
}

main()
