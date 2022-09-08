import type Stripe from 'stripe'

export const STRIPE_CONFIG = {
  // https://stripe.com/docs/api/versioning
  apiVersion: '2022-08-01' as Stripe.LatestApiVersion,
  maxNetworkRetries: 3, // (default is 0)
  timeout: 10000 // ms (default is 80000)
}

/**
 * A payment method made with a valid credit card that requires no SCA (Strong
 * Customer Authentication).
 *
 * @see [Testing - Stripe Docs](https://stripe.com/docs/testing)
 */
export const PAYMENT_METHOD_VALID_REQUIRES_NO_SCA = {
  card: {
    cvc: '123',
    exp_month: 12,
    exp_year: 2030,
    number: '4242424242424242'
  } as Stripe.PaymentMethodCreateParams.Card1,
  type: 'card' as Stripe.PaymentMethodCreateParams.Type
}
