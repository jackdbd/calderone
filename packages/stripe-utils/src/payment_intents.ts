import type Stripe from 'stripe'

export interface Config {
  pi_id: string
  stripe: Stripe
}

/**
 * Extracts the Stripe Customer from a Payment Intent Id.
 *
 * @public
 */
export const customerFromPaymentIntentId = async ({
  stripe,
  pi_id
}: Config) => {
  const pi = await stripe.paymentIntents.retrieve(pi_id)
  const customer = pi.customer
  if (customer === null) {
    return {
      error: new Error(
        `Stripe event ${pi.object}.${pi.status} ${pi.id} has no customer`
      )
    }
  } else if (typeof customer === 'string') {
    const cus = await stripe.customers.retrieve(customer)
    if (cus.deleted) {
      return { error: new Error(`Stripe customer ${cus.id} was deleted`) }
    } else {
      return {
        value: cus
      }
    }
  } else if (customer.deleted) {
    return { error: new Error(`Stripe customer ${customer.id} was deleted`) }
  } else {
    return {
      value: customer
    }
  }
}
