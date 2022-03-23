import { env } from 'node:process'
import {
  AlertPolicyServiceClient,
  MetricServiceClient
} from '@google-cloud/monitoring'

const listMetricDescriptors = async ({ client, projectId }) => {
  const request = {
    // name: client.projectMetricDescriptorPath(projectId, metricId),
    name: client.projectPath(projectId)
  }

  //   const [descriptors] = await client.listMetricDescriptors(request)

  // https://cloud.google.com/monitoring/api/v3/filters
  // group, metadata, metric, project, resource
  const filter = ''
  //   const filter = 'metric.type="compute.googleapis.com/instance/cpu/utilization"'

  // const computeMetricId = 'compute.googleapis.com/instance/cpu/utilization'
  // const filter = `metric.type="${computeMetricId}"`
  // const filter = `project = "${projectId}" AND resource.type = starts_with("pubsub")`
  const [descriptors] = await client.listMetricDescriptors({
    filter,
    name: client.projectPath(projectId)
  })

  console.log('Metric Descriptors:')
  descriptors.forEach((descriptor) => {
    console.log('descriptor', descriptor)
    const { name, metricKind, description, displayName } = descriptor
    console.log(displayName)
  })
}

const cloudRunRevisionDescriptors = async ({ client, projectId }) => {
  const filter = 'metric.type = starts_with("run.googleapis.com")'
  const [descriptors] = await client.listMetricDescriptors({
    filter,
    name: client.projectPath(projectId)
  })

  console.log('Cloud Run revision metric descriptors:')
  descriptors.forEach((descriptor, i) => {
    // console.log('descriptor', descriptor)
    const { name, metricKind, description, displayName } = descriptor
    console.log(`[${i}] ${descriptor.displayName}`)
    console.log(name)
  })
}

const getMetricDescriptor = async ({ client, metricId, projectId }) => {
  const request = {
    name: client.projectMetricDescriptorPath(projectId, metricId)
  }

  const [descriptor] = await client.getMetricDescriptor(request)

  const { description, displayName, metricKind, unit, valueType } = descriptor

  //   console.log(`\nName: ${displayName}`)
  //   console.log(`Description: ${description}`)
  //   console.log(`Type: ${descriptor.type}`)
  //   console.log(`Kind: ${metricKind}`)
  //   console.log(`Value Type: ${valueType}`)
  //   console.log(`Unit: ${unit}`)
  //   console.log('Labels:')
  //   descriptor.labels.forEach((label) => {
  //     console.log(`  ${label.key} (${label.valueType}) - ${label.description}`)
  //   })

  return {
    description,
    name: displayName,
    unit
  }
}

const listPolicies = async ({ client, projectId }) => {
  const listAlertPoliciesRequest = {
    name: client.projectPath(projectId)
  }
  const [policies] = await client.listAlertPolicies(listAlertPoliciesRequest)
  console.log('Policies:')
  policies.forEach((policy) => {
    // console.log('🚀 ~ policy', policy)
    console.log(`  Display name: ${policy.displayName}`)
    if (policy.documentation && policy.documentation.content) {
      console.log(`     Documentation: ${policy.documentation.content}`)
    }
  })
}

// WIP
const readTimeSeriesAggregate = async ({ client, projectId }) => {
  const seconds = Date.now() / 1000
  const request = {
    name: client.projectPath(projectId),
    // filter: 'metric.type="compute.googleapis.com/instance/cpu/utilization"',
    // filter: 'metric.type="run.googleapis.com/request_latencies"',
    // filter: 'metric.type="run.googleapis.com/request_count"',
    filter: 'metric.type="run.googleapis.com/container/memory/utilizations"',
    // filter: 'metric.type="run.googleapis.com/container/cpu/allocation_time"',
    interval: {
      startTime: {
        seconds: seconds - 3600 * 24 * 7
      },
      endTime: {
        seconds
      }
    },
    // Aggregate results per matching instance
    aggregation: {
      alignmentPeriod: {
        seconds: 600
      }
      //   perSeriesAligner: 'ALIGN_MEAN'
    }
  }

  // Writes time series data
  const [timeSeries] = await client.listTimeSeries(request)
  //   console.log(`there are ${timeSeries.length} time series`)
  console.log('timeSeries', timeSeries)
  //   console.log('CPU utilization:')
  timeSeries.forEach((data, i) => {
    const service_name = data.resource.labels.service_name
    console.log(`time series[${i}] service ${service_name}`)

    // console.log('🚀 ~ timeSeries.forEach ~ data', data)
    // console.log(data.metric.labels.instance_name)
    console.log(data.points[0].value)
    // if (data.points.length > 1) {
    //   console.log(`  10 min ago: ${data.points[1].value.doubleValue}`)
    // }
    // console.log('=====')
  })
}

const datapoint = (point) => {
  const t0 = point.interval.startTime.seconds
  const t1 = point.interval.endTime.seconds
  switch (point.value.value) {
    case 'distributionValue': {
      const { mean } = point.value.distributionValue
      return { value: mean, t0, t1 }
    }
    case 'doubleValue': {
      const value = point.value.doubleValue
      return { value, t0, t1 }
    }
    default: {
      throw new Error(`${point.value.value} not handled`)
    }
  }
}

// WIP
const cloudRunMemoryUtilization = async ({
  client,
  projectId,
  start_second,
  end_second
}) => {
  const filter =
    'metric.type="run.googleapis.com/container/memory/utilizations"'

  const request = {
    name: client.projectPath(projectId),
    filter: filter,
    interval: {
      startTime: {
        seconds: start_second
      },
      endTime: {
        seconds: end_second
      }
    }
  }

  const [timeSeries] = await client.listTimeSeries(request)

  timeSeries.forEach((data, i) => {
    const metric = data.metric.type
    const service_name = data.resource.labels.service_name
    console.log(
      `time series[${i}]: metric.type ${metric} for Cloud Run service ${service_name} between seconds [${start_second} ${end_second}]`
    )

    data.points.forEach((point) => {
      const d = datapoint(point)
      console.log(d)
    })
  })
}

const cloudRunAllocationTime = async ({
  client,
  projectId,
  start_second,
  end_second
}) => {
  const filter =
    'metric.type="run.googleapis.com/container/cpu/allocation_time"'

  const request = {
    name: client.projectPath(projectId),
    filter: filter,
    interval: {
      startTime: {
        seconds: start_second
      },
      endTime: {
        seconds: end_second
      }
    }
  }

  const [timeSeries] = await client.listTimeSeries(request)

  timeSeries.forEach((data, i) => {
    const metric = data.metric.type
    const service_name = data.resource.labels.service_name
    console.log(
      `time series[${i}]: metric.type ${metric} for Cloud Run service ${service_name} between seconds [${start_second} ${end_second}]`
    )

    data.points.forEach((point) => {
      const d = datapoint(point)
      console.log(d)
    })
  })
}

const cloudRunBillableInstanceTime = async ({
  client,
  projectId,
  start_second,
  end_second
}) => {
  const metricId = 'run.googleapis.com/container/billable_instance_time'
  const filter = `metric.type="${metricId}"`

  const { name, unit } = await getMetricDescriptor({
    client,
    metricId,
    projectId
  })

  const request = {
    name: client.projectPath(projectId),
    filter: filter,
    interval: {
      startTime: {
        seconds: start_second
      },
      endTime: {
        seconds: end_second
      }
    }
  }

  const [timeSeries] = await client.listTimeSeries(request)

  timeSeries.forEach((data, i) => {
    console.log(`${name} (unit: ${unit})`)
    const metric = data.metric.type
    const service_name = data.resource.labels.service_name
    console.log(
      `time series[${i}]: metric.type ${metric} for Cloud Run service ${service_name} between seconds [${start_second} ${end_second}]`
    )

    data.points.forEach((point) => {
      const d = datapoint(point)
      //   console.log(d)
    })
  })
}

const cloudRequestLatency = async ({
  client,
  projectId,
  start_second,
  end_second
}) => {
  const metricId = 'run.googleapis.com/request_latencies'
  const filter = `metric.type="${metricId}"`

  const { description, name, unit } = await getMetricDescriptor({
    client,
    metricId,
    projectId
  })

  const request = {
    name: client.projectPath(projectId),
    filter: filter,
    interval: {
      startTime: {
        seconds: start_second
      },
      endTime: {
        seconds: end_second
      }
    }
  }

  const [timeSeries] = await client.listTimeSeries(request)

  timeSeries.forEach((data, i) => {
    console.log(`${name} (unit: ${unit})`)
    console.log(description)

    const metric = data.metric.type
    const service_name = data.resource.labels.service_name
    console.log(
      `time series[${i}]: metric.type ${metric} for Cloud Run service ${service_name} between seconds [${start_second} ${end_second}]`
    )

    data.points.forEach((point) => {
      const d = datapoint(point)
      console.log(d)
    })
  })
}

const main = async () => {
  const projectId = env.GCP_PROJECT_ID
  const metrics_client = new MetricServiceClient({ projectId })
  //   const [timeSeries] = await metrics_client.listTimeSeries(request)
  //   const alert_policies_client = new AlertPolicyServiceClient({ projectId })

  //   await listMetricDescriptors({ client: metrics_client, projectId })
  //   await cloudRunRevisionDescriptors({ client: metrics_client, projectId })

  //   const metricId = 'run.googleapis.com/container/billable_instance_time'
  //   await getMetricDescriptor({ client: metrics_client, metricId, projectId })

  //   await listPolicies({ client: alert_policies_client, projectId })
  //   await readTimeSeriesAggregate({ client: metrics_client, projectId })

  const seconds = Date.now() / 1000
  // last week
  const start_second = seconds - 3600 * 24 * 7
  // last month
  // const start_second = seconds - 3600 * 24 * 7 * 30
  const end_second = seconds

  await cloudRunBillableInstanceTime({
    client: metrics_client,
    projectId,
    start_second,
    end_second
  })

  await cloudRunMemoryUtilization({
    client: metrics_client,
    projectId,
    start_second,
    end_second
  })

  //   await cloudRunAllocationTime({
  //     client: metrics_client,
  //     projectId,
  //     start_second,
  //     end_second
  //   })

  //   await cloudRequestLatency({
  //     client: metrics_client,
  //     projectId,
  //     start_second,
  //     end_second
  //   })
}

main()
