import Wreck from '@hapi/wreck'
import makeDebug from 'debug'

const debug = makeDebug('webhooks/routes/webpagetest/utils')

interface Payload {
  data: {
    [k: string]: {
      addresses: string[]
      id: string
      label: string
    }
  }
}

/**
 * Retrieve the IP addresses of all WebPageTest public testers.
 */
export const testerIps = async () => {
  const WEBPAGETEST_TESTER_IPS_URL = 'https://www.webpagetest.org/addresses.php'

  // do NOT wrap this HTTP request in a try/catch block. If this request fails,
  // I WANT the application to crash, because if the app can't retrieve the
  // WebPageTest tester IPs, the /webpagetest route of cannot work.
  const { payload } = await Wreck.get<Buffer>(
    `${WEBPAGETEST_TESTER_IPS_URL}?f=json`
  )

  const { data } = JSON.parse(payload.toString()) as Payload

  const ips = Object.entries(data).flatMap(([tester_id, value]) => {
    const { addresses, label } = value
    debug(`${tester_id} [${label}] has these IPs: %o`, addresses)
    return addresses
  })

  return ips
}

export const AUTH_STRATEGY = {
  allow_pingbacks_from_webpagetest_api: 'webpagetest-pingback'
}
