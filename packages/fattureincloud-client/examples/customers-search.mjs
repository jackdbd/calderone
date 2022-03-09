import { env } from 'process'
import { basicClient } from '../lib/customers/clients.js'

const main = async () => {
  const customers = basicClient({
    api_key: env.FATTURE_IN_CLOUD_API_KEY,
    api_uid: env.FATTURE_IN_CLOUD_API_UID
  })

  try {
    const paginated = await customers.list({
      codice_fiscale: 'ZR',
      name: 'trattoria',
      partita_iva: '04'
    })
    console.log(
      `page ${paginated.current_page}/${paginated.total_pages} has ${paginated.results.length} customers`
    )
    console.log('paginated.results', paginated.results)
  } catch (err) {
    console.error(err.message)
  }

  try {
    const customer = await customers.retrieve({
      codice_fiscale: 'RZZRFL88H29G751K'
    })
    console.log(`customer`, customer)
  } catch (err) {
    console.error(err.message)
  }
}

main()
