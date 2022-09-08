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
  DuplicatesConfig,
  EmailIds
} from './customers.js'

export { errorFromStripe } from './errors.js'

export { customerFromPaymentIntentId } from './payment_intents.js'
export type { Config as CustomerFromPaymentIntentIdConfig } from './payment_intents.js'

export { createPriceWithTaxBehavior } from './prices.js'
export type { Config as CreatePriceWithTaxBehaviorConfig } from './prices.js'

export { stripeAccountMode } from './utils.js'

export { enabledEventsForWebhookEndpoint } from './webhooks.js'
export type { EnabledEventsForWebhookEndpoint } from './webhooks.js'
