import { env } from 'process'
import { basicClient } from '../lib/customers/clients.js'

const TEST_RAGIONE_SOCIALE = 'TEST COMPANY LTD of John Doe'
const TEST_CODICE_FISCALE = 'XYZABC84D20G628W'
const TEST_EMAIL = 'john@doe.com'
const TEST_PARTITA_IVA = '12345678901'

const main = async () => {
  const customers = basicClient({
    api_key: env.FATTURE_IN_CLOUD_API_KEY,
    api_uid: env.FATTURE_IN_CLOUD_API_UID
  })

  let id
  try {
    const created = await customers.create({
      codice_fiscale: TEST_CODICE_FISCALE,
      ragione_sociale: TEST_RAGIONE_SOCIALE
    })
    console.log('CREATE', created)
    id = created.id
  } catch (err) {
    console.error(err.message)
    return
  }

  try {
    const customer = await customers.retrieve({ id })
    console.log('READ (by id)', customer)
  } catch (err) {
    console.error(err.message)
  }

  try {
    const res = await customers.update({
      email: TEST_EMAIL,
      id,
      partita_iva: TEST_PARTITA_IVA
    })
    console.log('UPDATE', res.id, res.campi)
  } catch (err) {
    console.error(err.message)
  }

  try {
    const customer = await customers.retrieve({ partita_iva: TEST_PARTITA_IVA })
    console.log('READ (by partita_iva)', customer)
  } catch (err) {
    console.error(err.message)
  }

  try {
    const deleted = await customers.delete({ id })
    console.log('DELETE', deleted)
  } catch (err) {
    console.error(err.message)
  }
}

main()
