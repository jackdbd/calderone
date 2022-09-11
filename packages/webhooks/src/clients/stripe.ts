import Stripe from 'stripe'
import { makeLog } from '@jackdbd/tags-logger'
import { APP_NAME } from '../constants.js'

const log = makeLog({
  namespace: process.env.K_SERVICE ? undefined : `${APP_NAME}/clients/stripe`
})

interface Config {
  api_key: string
}

export const stripe = ({ api_key }: Config) => {
  const stripe_config = {
    // https://stripe.com/docs/api/versioning
    apiVersion: '2022-08-01' as Stripe.LatestApiVersion,
    maxNetworkRetries: 3,
    timeout: 10000 // ms
  }

  log({
    message: `initialize Stripe with this configuration (see JSON payload)`,
    tags: ['debug', 'client', 'stripe'],
    stripe_config
  })

  return new Stripe(api_key, stripe_config)
}
