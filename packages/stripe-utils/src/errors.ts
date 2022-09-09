import Stripe from 'stripe'

/**
 * Converts an error coming from Stripe into an object with a consistent shape.
 *
 * @public
 *
 * @see [Error.js - stripe-node](https://github.com/stripe/stripe-node/blob/master/lib/Error.js)
 * @see [Error Handling - stripe-node Wiki](https://github.com/stripe/stripe-node/wiki/Error-Handling)
 * @see [Error codes - Stripe Docs](https://stripe.com/docs/error-codes)
 */
export const errorFromStripe = (err: Stripe.errors.StripeError) => {
  const prefix = '[stripe] '

  if (err instanceof Stripe.errors.StripeAPIError) {
    return {
      code: err.code,
      message: `${prefix}${err.message}`,
      param: err.param,
      status_code: err.statusCode || 500
    }
  }

  if (err instanceof Stripe.errors.StripeAuthenticationError) {
    return {
      code: err.code,
      message: `${prefix}${err.message}`,
      param: err.param,
      status_code: err.statusCode || 401
    }
  }

  if (err instanceof Stripe.errors.StripeInvalidGrantError) {
    return {
      code: err.code,
      message: `${prefix}${err.message}`,
      param: err.param,
      status_code: err.statusCode || 403
    }
  }

  if (err instanceof Stripe.errors.StripeInvalidRequestError) {
    return {
      code: err.code,
      message: `${prefix}${err.message}`,
      param: err.param,
      status_code: err.statusCode || 400
    }
  }

  if (err instanceof Stripe.errors.StripePermissionError) {
    return {
      code: err.code,
      message: `${prefix}${err.message}`,
      param: err.param,
      status_code: err.statusCode || 403
    }
  }

  if (err instanceof Stripe.errors.StripeRateLimitError) {
    return {
      code: err.code,
      message: `${prefix}${err.message}`,
      param: err.param,
      status_code: err.statusCode || 429
    }
  }

  if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
    return {
      code: err.code,
      message: `${prefix}${err.message}`,
      param: err.param,
      status_code: err.statusCode || 400
    }
  }

  return {
    code: err.code,
    message: `${prefix}${err.message} (err.type: ${err.type})`,
    param: err.param,
    status_code: err.statusCode || 500
  }
}
