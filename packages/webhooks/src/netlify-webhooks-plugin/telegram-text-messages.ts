import type { FormSubmissionSummary } from './interfaces.js'

export const MAX_CHARS = 4096

interface Config extends FormSubmissionSummary {
  site_name: string
}

export const formSubmissionText = ({
  email,
  form_id,
  form_name,
  ip,
  message,
  name,
  remaining_submissions,
  site_name,
  site_url,
  user_agent
}: Config) => {
  let s = `<b>New submission for form: ${form_name}</b>`

  s = `${s}\n\n<b>From</b> ${name} (${email})`
  s = `${s}\n<b>Message</b> <i>${message}</i>`

  const anchor_tags = [
    `<a href="${site_url}">Netlify website</a>`,
    `<a href="https://app.netlify.com/sites/${site_name}/forms/${form_id}">Form submissions</a>`,
    `<a href="https://www.whatismyip.com/ip-address-lookup/?ip=${ip}">IP lookup</a>`
  ]

  s = `${s}\n\n${anchor_tags.map((a) => `🔗 ${a}`).join('\n')}`

  s = `${s}\n\nRemaining submissions for form id ${form_id}: ${remaining_submissions}`

  s = `${s}\n\nUser agent: <pre>${user_agent}</pre>`

  return s.slice(0, MAX_CHARS)
}
