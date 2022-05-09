import makeDebug from 'debug'
import Bottleneck from 'bottleneck'

const debug = makeDebug('fattureincloud-client/rate-limit')

type PromiseReturningFn = (...args: any) => Promise<any>
type AsyncGenReturningFn = (...args: any) => AsyncGenerator<any, void, unknown>

type Client = {
  [fn_name: string]: PromiseReturningFn | AsyncGenReturningFn
}

interface Value {
  default: number
  provided: number | null | undefined
}

const providedOrDefault = (v: Value) => {
  if (v.provided === undefined || v.provided === null) {
    return v.default
  } else {
    return v.provided
  }
}

/**
 * Wrap all methods of a FattureInCloud API client in a rate limit and return a
 * new client that has a rate-limited version of all of its methods.
 *
 * The FattureInCloud API allows only 30 requests per minute.
 */
export const rateLimitedClient = (
  client: Client,
  options?: Bottleneck.ConstructorOptions
) => {
  // https://github.com/SGrondin/bottleneck#reservoir-intervals
  const limiter_options: Bottleneck.ConstructorOptions = {
    reservoir: providedOrDefault({
      default: 29,
      provided: options?.reservoir
    }),
    reservoirRefreshAmount: providedOrDefault({
      default: 29,
      provided: options?.reservoirRefreshAmount
    }),
    reservoirRefreshInterval: providedOrDefault({
      default: 60 * 1000,
      provided: options?.reservoirRefreshInterval
    })
  }

  const limiter = new Bottleneck(limiter_options)
  debug('limiter options %O', limiter_options)

  const rate_limited_client: Client = {}
  Object.entries(client).forEach((entry) => {
    const [fn_name, fn] = entry
    // a function that returns an async generator COULD be wrapped with
    // limiter.wrap(), but if I do so, then a user of the rate-limited version
    // of the client library would need to await the wrapped function to get the
    // async generator. I.e. the use would be different from basic,
    // non-rate-limited client and rate-limited client:
    // - const async_gen = basic_client.customers.listAsyncGenerator()
    // - const async_gen = await rate_limited_client.customers.listAsyncGenerator()
    if (fn_name.toLowerCase().includes('generator')) {
      debug(
        `assume that function "${fn_name}" returns an async generator. Don't wrap`
      )
      rate_limited_client[fn_name] = fn
    } else {
      debug(
        `assume that function "${fn_name}" returns a promise. Create rate-limited version`
      )
      const rate_limited_fn = limiter.wrap(fn as PromiseReturningFn)
      rate_limited_client[fn_name] = rate_limited_fn
    }
  })
  return rate_limited_client
}
