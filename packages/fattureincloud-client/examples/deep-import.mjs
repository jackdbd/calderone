import { env } from 'process'
import { list } from '../lib/customers/api.js'

const main = async () => {
  const credentials = {
    api_key: env.FATTURE_IN_CLOUD_API_KEY,
    api_uid: env.FATTURE_IN_CLOUD_API_UID
  }

  const options = { codice_fiscale: 'RN', partita_iva: '01' }

  try {
    const paginated = await list(credentials, options)
    const { current_page: current, total_pages: tot, results } = paginated
    console.log(`page ${current}/${tot}: retrieved ${results.length} customers`)
  } catch (err) {
    console.error(err.message)
  }
}

main()
