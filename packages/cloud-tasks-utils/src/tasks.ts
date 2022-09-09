import type { CloudTasksClient } from '@google-cloud/tasks'
import {
  httpRequestToGCPService,
  httpRequestToThirdPartyService
} from './http-requests.js'

export interface TaskToGCPServiceConfig {
  cloud_tasks: CloudTasksClient
  enqueued_by: string
  id: string
  payload: any
  project_id: string
  queue_id: string
  queue_location_id: string
  scheduleTimeInSeconds: number
  dispatchDeadlineInSeconds: number
  service_account: string
  url: string
}

/**
 * Defines a task which makes a HTTP requests to a GCP service (using a service
 * account).
 */
export const taskToGCPService = (config: TaskToGCPServiceConfig) => {
  const {
    cloud_tasks,
    dispatchDeadlineInSeconds,
    enqueued_by,
    id,
    payload,
    project_id,
    queue_id,
    queue_location_id,
    scheduleTimeInSeconds,
    service_account,
    url
  } = config

  const parent = cloud_tasks.queuePath(project_id, queue_location_id, queue_id)

  return {
    parent,
    task: {
      name: `${parent}/tasks/${id}`,
      httpRequest: httpRequestToGCPService({
        enqueued_by,
        payload,
        service_account,
        url
      }),
      scheduleTime: { seconds: scheduleTimeInSeconds },
      dispatchDeadline: { seconds: dispatchDeadlineInSeconds }
    }
  }
}

export interface TaskToThirdPartyService {
  api_key: string
  cloud_tasks: CloudTasksClient
  enqueued_by: string
  id: string
  payload: any
  project_id: string
  queue_id: string
  queue_location_id: string
  scheduleTimeInSeconds: number
  dispatchDeadlineInSeconds: number
  url: string
}

/**
 * Defines a task which makes a HTTP requests to a third-party API (using an API
 * key).
 */
export const taskToThirdPartyService = (config: TaskToThirdPartyService) => {
  const {
    api_key,
    cloud_tasks,
    dispatchDeadlineInSeconds,
    enqueued_by,
    id,
    payload,
    project_id,
    queue_id,
    queue_location_id,
    scheduleTimeInSeconds,
    url
  } = config

  const parent = cloud_tasks.queuePath(project_id, queue_location_id, queue_id)

  return {
    parent,
    task: {
      name: `${parent}/tasks/${id}`,
      httpRequest: httpRequestToThirdPartyService({
        api_key,
        enqueued_by,
        payload,
        url
      }),
      scheduleTime: { scheduleTimeInSeconds },
      dispatchDeadline: { dispatchDeadlineInSeconds }
    }
  }
}
