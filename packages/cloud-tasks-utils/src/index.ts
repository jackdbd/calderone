/**
 * Entry point for the documentation of cloud-tasks-utils.
 *
 * @packageDocumentation
 */
export { cloudTasks } from './client.js'
export type { Options as ClientOptions } from './client.js'

export {
  httpRequestToGCPService,
  httpRequestToThirdPartyService
} from './http-requests.js'
export type {
  HttpRequestToGCPServiceConfig,
  HttpRequestToThirdPartyServiceConfig
} from './http-requests.js'

export { taskToGCPService, taskToThirdPartyService } from './tasks.js'
export type {
  TaskToGCPServiceConfig,
  TaskToThirdPartyService
} from './tasks.js'
