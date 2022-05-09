import makeDebug from 'debug'
import type Stripe from 'stripe'

const debug = makeDebug('stripe-utils/webhooks')

interface EnabledEventsForWebhookEndpoint {
  stripe: Stripe
  url: string
}

export const notWebhookEnpointForStripeAccount = (url: string) =>
  `The URL you passed (${url}) is not a Stripe webhook endpoint for this Stripe account. Maybe you passed a Stripe client in TEST mode and a URL which is a webhook endpoint for Stripe in LIVE mode, or vice versa?`

/**
 * List of webhook events that the Stripe account `stripe` is allowed to send to
 * the webhook endpoint `url`.
 *
 * *Note*: you have to configure the events that Stripe sends to a webhook
 * endpoint when you create/update a webhook endpoint in your Stripe account.
 */
export const enabledEventsForWebhookEndpoint = async ({
  stripe,
  url
}: EnabledEventsForWebhookEndpoint) => {
  const we_all = await stripe.webhookEndpoints.list()
  debug(
    `${we_all.data.length} webhook endpoints configured for this Stripe account`
  )
  const we_matching_url = we_all.data.filter((d) => d.url === url)
  if (we_matching_url.length === 0) {
    throw new Error(notWebhookEnpointForStripeAccount(url))
  } else {
    return we_matching_url[0].enabled_events
  }
}
