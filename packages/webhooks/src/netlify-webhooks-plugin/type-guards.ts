import type {
  NetlifyDeployStartedEvent,
  NetlifyFormSubmissionEvent,
  RequestPayload
} from './interfaces.js'

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates
export function isFormSubmission(
  payload: RequestPayload
): payload is NetlifyFormSubmissionEvent {
  return (payload as NetlifyFormSubmissionEvent).form_id !== undefined
}

export function isDeployStarted(
  payload: RequestPayload
): payload is NetlifyDeployStartedEvent {
  return (payload as NetlifyDeployStartedEvent).state === 'building'
}
