import type Stripe from 'stripe'

export interface Config {
  stripe: Stripe
  stripe_event_list_params: Stripe.EventListParams
}

export interface Options {
  stripe_request_options?: Stripe.RequestOptions
}

const DEFAULT_OPTIONS: Required<Options> = {
  stripe_request_options: { apiVersion: '2022-08-01' }
}

interface Creation {
  id: string
}

export interface Change {
  field: string
  before: any
  now: any
}

interface Update {
  id: string
  changes: Change[]
}

export interface ReportDatum {
  api_version: string
  created: number
  creation?: Creation
  update?: Update
  id: string
  type: string
  livemode: boolean
}

export const reportData = async (
  config: Config,
  options: Options = DEFAULT_OPTIONS
) => {
  const { stripe, stripe_event_list_params } = config

  const stripe_request_options =
    options.stripe_request_options !== undefined
      ? options.stripe_request_options
      : DEFAULT_OPTIONS.stripe_request_options

  const events: Stripe.Event[] = []
  const data: ReportDatum[] = []

  for await (const ev of stripe.events.list(
    stripe_event_list_params,
    stripe_request_options
  )) {
    // console.log('🚀 ~ ev.object', ev.object)
    // console.log('🚀 ~ ev.data.object', ev.data.object)
    // console.log('🚀 ~ ev.request', ev.request)

    let creation: Creation | undefined = undefined
    let update: Update | undefined = undefined
    if (ev.type === 'customer.created') {
      creation = { id: (ev.data.object as any).id as string }
    } else if (ev.type === 'customer.updated') {
      const changes: Change[] = []
      if (ev.data.previous_attributes) {
        const entries = Object.entries(ev.data.previous_attributes)
        entries.forEach(([field, pre], _j) => {
          const post = (ev.data.object as any)[field]
          changes.push({ field, before: pre, now: post })
        })
        update = { id: (ev.data.object as any).id as string, changes }
      } else {
        throw new Error(
          `WHAT TO DO? ${ev.id} is of type ${ev.type} but has no data.previous_attributes`
        )
      }
    } else if (ev.type === 'customer.subscription.updated') {
      const changes: Change[] = []
      if (ev.data.previous_attributes) {
        const entries = Object.entries(ev.data.previous_attributes)
        entries.forEach(([field, pre], _j) => {
          const post = (ev.data.object as any)[field]
          changes.push({ field, before: pre, now: post })
        })
        update = { id: (ev.data.object as any).id as string, changes }
      } else {
        throw new Error(
          `WHAT TO DO? ${ev.id} is of type ${ev.type} but has no data.previous_attributes`
        )
      }
    } else {
      console.log(`=== ${ev.type} ===`, ev)
      throw new Error(`NOT implemented: ${ev.type}`)
    }

    data.push({
      api_version: ev.api_version!,
      created: ev.created,
      creation,
      update,
      id: ev.id,
      type: ev.type,
      livemode: ev.livemode
    })

    events.push(ev)
  }

  return { data, events }
}
