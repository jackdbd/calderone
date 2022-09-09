import { anchor } from '@jackdbd/telegram-text-messages'

export const apiMode = (livemode: boolean) => (livemode ? 'LIVE' : 'TEST')

export const customerAnchor = (customer_id: string, livemode: boolean) => {
  const base_url = livemode
    ? 'https://dashboard.stripe.com/customers/'
    : 'https://dashboard.stripe.com/test/customers/'

  return anchor({ href: `${base_url}${customer_id}`, text: customer_id })
}

export const eventAnchor = (event_id: string, livemode: boolean) => {
  const base_url = livemode
    ? 'https://dashboard.stripe.com/events/'
    : 'https://dashboard.stripe.com/test/events/'

  return anchor({ href: `${base_url}${event_id}`, text: event_id })
}
