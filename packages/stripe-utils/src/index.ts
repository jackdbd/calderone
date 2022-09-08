/**
 * Utility functions that might be useful when working with Stripe.
 *
 * @packageDocumentation
 */

export { isApiKeyLiveMode, isApiKeyTestMode } from './checks.js'

export { StripeApiMode, StripeTaxCode } from './constants.js'

export { customersWithDuplicateEmails, duplicates } from './customers.js'
export type {
  ConfigCustomersWithDuplicateEmails,
  CustomersByEmail,
  DuplicatesConfig
} from './customers.js'

export { errorFromStripe } from './errors.js'

export { customerFromPaymentIntentId } from './payment_intents.js'

export { createPriceWithTaxBehavior } from './prices.js'

export { stripeAccountMode } from './utils.js'

export { enabledEventsForWebhookEndpoint } from './webhooks.js'
