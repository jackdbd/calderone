import { StripeApiMode } from '@jackdbd/stripe-utils'
import {
  stripeClient,
  createPaymentMethodAndAttachToCustomer,
  pay
} from './utils.js'

export const main = async () => {
  const stripe = await stripeClient(StripeApiMode.Test)

  const email = 'mario@rossi.com'

  const customers = await stripe.customers.search({
    query: `email:"${email}"`
  })

  if (customers.data.length === 0) {
    console.log(`there are no customers with email "${email}"`)
    return
  }

  if (customers.data.length > 1) {
    console.log(
      `there is more than one customer with email "${email}". The payment method will be attached only to the first one`
    )
  }

  const cus = customers.data[0]
  const { payment_method } = await createPaymentMethodAndAttachToCustomer(
    stripe,
    cus.id
  )

  const created_by = 'fake-one-time-payment.ts script'

  const { message } = await pay({
    amount: 150, // in EUR cents
    cus,
    description: `test payment created by ${created_by}`,
    stripe,
    name: created_by,
    pm: payment_method
  })
  console.log(message)
}

main()
