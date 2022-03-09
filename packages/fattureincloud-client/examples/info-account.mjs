import { env } from 'process'
import { basicClient } from '../lib/info/clients.js'

const main = async () => {
  const info = basicClient({
    api_key: env.FATTURE_IN_CLOUD_API_KEY,
    api_uid: env.FATTURE_IN_CLOUD_API_UID
  })

  const fields = [
    'durata_licenza',
    'lista_conti',
    'lista_iva',
    'lista_template',
    'nome',
    'tipo_licenza'
  ]

  try {
    const account = await info.account(fields)
    console.log('info account', account)
  } catch (err) {
    console.error(err.message)
  }
}

main()
