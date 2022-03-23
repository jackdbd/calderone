import type {
  FormSubmissionSummary,
  NetlifyFormSubmissionEvent,
  NetlifyDeployStartedEvent
} from './interfaces.js'
import { FORM_SUBMISSIONS_PER_MONTH } from './constants.js'

export const formSubmissionToSummary = (
  payload: NetlifyFormSubmissionEvent
): FormSubmissionSummary => {
  const { created_at, data, form_id, form_name, site_url } = payload

  const submissions_this_month = parseInt(`${payload.number}`, 10)

  return {
    created_at,
    email: data.email,
    form_id: form_id,
    form_name: form_name,
    ip: data.ip,
    message: data.message,
    name: data.name,
    remaining_submissions: FORM_SUBMISSIONS_PER_MONTH - submissions_this_month,
    site_url,
    user_agent: data.user_agent
  }
}

export const deployStartedToSummary = (payload: NetlifyDeployStartedEvent) => {
  return payload
}
