import Stripe from 'stripe'
import { StripeApiMode } from '@jackdbd/stripe-utils'
import { LOCALE_STRING_OPTIONS } from '@jackdbd/utils/dates'
import { localJSONSecret } from '../utils.js'
import {
  STRIPE_CONFIG,
  PAYMENT_METHOD_VALID_REQUIRES_NO_SCA
} from './constants.js'

interface StripeSecret {
  api_key: string
}

export const stripeClient = async (api_mode: StripeApiMode) => {
  if (api_mode !== StripeApiMode.Live && api_mode !== StripeApiMode.Test) {
    throw new Error(
      `'${api_mode}' is not a valid Stripe API mode. Stripe mode can be either '${StripeApiMode.Live}' or '${StripeApiMode.Test}'`
    )
  }

  const { api_key } = await localJSONSecret<StripeSecret>(
    `stripe-${api_mode.toLowerCase()}.json`
  )

  return new Stripe(api_key, STRIPE_CONFIG)
}

/**
 * Create a payment method, attach it to the customer and update the invoice
 * settings of the customer.
 */
export const createPaymentMethodAndAttachToCustomer = async (
  stripe: Stripe,
  customer_id: string
) => {
  const pm = await stripe.paymentMethods.create(
    PAYMENT_METHOD_VALID_REQUIRES_NO_SCA
  )

  const pm_attached = await stripe.paymentMethods.attach(pm.id, {
    customer: customer_id
  })

  const customer = await stripe.customers.update(customer_id, {
    invoice_settings: {
      default_payment_method: pm_attached.id
    }
  })

  return { customer, payment_method: pm_attached }
}

interface PayConfig {
  amount: number
  cus: Stripe.Customer
  description: string
  name: string
  pm: Stripe.PaymentMethod
  stripe: Stripe
}

/**
 * Create a payment_intent and confirm it.
 */
export const pay = async ({
  amount,
  cus,
  description,
  name,
  pm,
  stripe
}: PayConfig) => {
  let desc = 'something'
  try {
    const product = await stripe.products.retrieve(description)
    desc = product.name
  } catch (err: any) {
    console.warn(`[${name}] ${err.message}`)
  }

  const currency = 'eur'

  const params: Stripe.PaymentIntentCreateParams = {
    amount,
    currency,
    customer: cus.id,
    payment_method: pm.id,
    metadata: {
      created_by: name,
      created_at: new Date().toLocaleString('it-IT', LOCALE_STRING_OPTIONS)
    }
  }

  console.log(
    `[${name}] [${cus.email}] wants to pay for [${desc}] with [${pm.type}] [${pm.id}]`
  )
  let pi: Stripe.PaymentIntent
  try {
    pi = await stripe.paymentIntents.create(params)
    console.log(`[${name}] ${pi.id} created (status ${pi.status})`)
  } catch (err: any) {
    return { message: `[${name}] ${err.message}` }
  }

  try {
    // {setup_future_usage}
    const pi_confirmed = await stripe.paymentIntents.confirm(pi.id)
    console.log(`[${name}] ${pi.id} confirmed (status ${pi_confirmed.status})`)
    return { message: `[${name}] ${cus.email} paid for ${pi.description}` }
  } catch (err: any) {
    return { message: `[${name}] ${err.message}` }
  }
}
