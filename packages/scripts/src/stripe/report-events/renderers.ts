import { isBoolean, isNumber, isString } from '@jackdbd/checks'
import { genericText } from '@jackdbd/telegram-text-messages'
import type { Section } from '@jackdbd/telegram-text-messages'
import type { Report } from './report.js'
import { apiMode, customerAnchor, eventAnchor } from './utils.js'

export const stdoutConverter = (x: any) => {
  if (x === null) {
    return x as null
  } else if (x === undefined) {
    return x as undefined
  } else if (isBoolean(x) || isNumber(x) || isString(x)) {
    return x as boolean | number | string
  } else {
    return JSON.stringify(x)
  }
}

export const telegramConverter = (x: any) => {
  if (x === null) {
    return x as null
  } else if (x === undefined) {
    return x as undefined
  } else if (isBoolean(x) || isNumber(x) || isString(x)) {
    return x as boolean | number | string
  } else {
    const s = JSON.stringify(x, null, 2)
    // const max_chars = 300
    // return s.length < max_chars
    //   ? s
    //   : `${s.slice(0, max_chars)} (clipped to ${max_chars})`
    return `<pre>${s}</pre>`
  }
}

export const renderToStdOut = (report: Report) => {
  const { title, entries } = report

  const creations: string[] = []
  const updates: string[] = []

  for (const entry of entries) {
    if (entry.changes) {
      const changes = entry.changes.map((ch) => {
        const before = stdoutConverter(ch.before)
        const now = stdoutConverter(ch.now)
        return `field: ${ch.field}\nbefore:\n${before}\nnow:\n${now}`
      })

      const s_event = entry.event_id
      const s_resource = entry.resource_id

      const details = [
        `${s_event}: ${entry.event_type} ${s_resource} (API mode: ${apiMode(
          entry.livemode
        )}, API version ${entry.api_version})`,
        changes.join('\n')
      ]
      updates.push(details.join('\n'))
    } else {
      const s_event = entry.event_id
      const s_resource = entry.resource_id

      creations.push(
        `${s_event}: ${entry.event_type} ${s_resource} (API mode: ${apiMode(
          entry.livemode
        )}, API version ${entry.api_version})`
      )
    }
  }

  return `${title}\n\n${creations.join('\n\n')}\n\n${updates.join('\n\n')}`
}

export const renderToTelegram = (report: Report) => {
  const { title, entries } = report

  const creations: string[] = []
  const updates: string[] = []

  for (const entry of entries) {
    if (entry.changes) {
      const changes = entry.changes.map((ch) => {
        const before = telegramConverter(ch.before)
        const now = telegramConverter(ch.now)
        return `field: <code>${ch.field}</code>\nbefore:\n${before}\nnow:\n${now}`
      })

      let s_resource: string
      if (
        entry.event_type === 'customer.created' ||
        entry.event_type === 'customer.updated'
      ) {
        s_resource = customerAnchor(entry.resource_id, entry.livemode)
      } else {
        s_resource = entry.resource_id
      }

      const s_event = eventAnchor(entry.event_id, entry.livemode)

      const details = [
        `${s_event}: ${entry.event_type} ${s_resource} (API mode: ${apiMode(
          entry.livemode
        )}, API version ${entry.api_version})`,
        changes.join('\n')
      ]
      updates.push(details.join('\n'))
    } else {
      let s_resource: string
      if (
        entry.event_type === 'customer.created' ||
        entry.event_type === 'customer.updated'
      ) {
        s_resource = customerAnchor(entry.resource_id, entry.livemode)
      } else {
        s_resource = entry.resource_id
      }

      const s_event = eventAnchor(entry.event_id, entry.livemode)

      creations.push(
        `${s_event}: ${entry.event_type} ${s_resource} (API mode: ${apiMode(
          entry.livemode
        )}, API version ${entry.api_version})`
      )
    }
  }

  const sections: Section[] = []

  if (creations.length > 0) {
    sections.push({
      title: 'Creations',
      body: creations.join('\n\n')
    })
  }

  if (updates.length > 0) {
    sections.push({
      title: 'Updates',
      body: updates.join('\n\n')
    })
  }

  return genericText({
    title,
    sections,
    description: `Report about Stripe events`
  })
}
