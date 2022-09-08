import type { Change, ReportDatum } from './data.js'

export interface Config {
  data: ReportDatum[]
  data_source: string
}

export interface Entry {
  api_version: string
  // api_mode: 'live' | 'test'
  event_id: string
  event_type: string
  livemode: boolean
  resource_id: string
  changes?: Change[]
}

export interface Report {
  title: string
  entries: Entry[]
}

export const report = (config: Config): Report => {
  const { data, data_source } = config

  const title = `Stripe events from ${data_source}`

  const entries: Entry[] = []

  data.forEach((d) => {
    // const api_mode = d.livemode ? 'live' : 'test'

    if (d.creation) {
      entries.push({
        api_version: d.api_version,
        event_id: d.id,
        event_type: d.type,
        livemode: d.livemode,
        resource_id: d.creation.id
      })
    }

    if (d.update) {
      const changes = d.update.changes.map((ch) => {
        return {
          field: ch.field,
          before: ch.before,
          now: ch.now
        }
      })

      entries.push({
        api_version: d.api_version,
        event_id: d.id,
        event_type: d.type,
        livemode: d.livemode,
        resource_id: d.update.id,
        changes
      })
    }
  })

  return { title, entries }
}
