import { env } from 'process'
import { basicClient, rateLimitedClient } from '../lib/index.js'

const demo = async (fic) => {
  for (let i = 1; i <= 35; i++) {
    try {
      const paginated = await fic.customers.list()
      const n = paginated.results.length
      console.log(`request ${i}: retrieved ${n} customers`)
    } catch (err) {
      console.error(`request ${i}: ${err.message}`)
    }
  }
}

const autoPaginationDemo = async (fic) => {
  const async_gen = fic.customers.listAsyncGenerator()

  for await (const v of async_gen) {
    const n = v.results.length
    console.log(
      `page ${v.current_page}/${v.total_pages}: retrieved ${n} customers`
    )
  }
}

const main = async () => {
  const credentials = {
    api_key: env.FATTURE_IN_CLOUD_API_KEY,
    api_uid: env.FATTURE_IN_CLOUD_API_UID
  }

  // client without any rate limit. The FattureInCloud API allows only 30
  // requests per minute, so a few of the last requests will fail.
  const basic_client = basicClient(credentials)

  // here we set reservoir to 0 (i.e. we wait before firing the first request)
  // only because we have just exceeded the rate limit using the basic client.
  const rate_limited_client = rateLimitedClient(credentials, { reservoir: 0 })

  await demo(basic_client)
  await demo(rate_limited_client)

  // the way to perform auto-pagination doesn't change bewteen basic,
  // non-rate-limited client and rate-limited client.
  await autoPaginationDemo(basic_client)
  await autoPaginationDemo(rate_limited_client)
}

main()
