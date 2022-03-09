import { env } from 'process'
import { basicClient } from '../lib/products/clients.js'

const TEST_CODICE = 'some_product_code'
const TEST_CATEGORIA = 'CONSULENZA'
const TEST_DESC = 'Descrizione del prodotto di test'
const TEST_NOTE = 'Questo prodotto è stato creato con uno script'
const TEST_NOME = 'Prodotto di Test'
const TEST_PREZZO_NETTO = 1.23

export const main = async () => {
  const products = basicClient({
    api_key: env.FATTURE_IN_CLOUD_API_KEY,
    api_uid: env.FATTURE_IN_CLOUD_API_UID
  })

  let id
  try {
    const created = await products.create({
      categoria: TEST_CATEGORIA,
      cod: TEST_CODICE,
      desc: TEST_DESC,
      nome: TEST_NOME,
      note: TEST_NOTE,
      prezzo_netto: TEST_PREZZO_NETTO
    })
    console.log('CREATE', created)
    id = created.id
  } catch (err) {
    console.error(err.message)
    return
  }

  try {
    const product = await products.retrieve({ id })
    console.log('READ (by id)', product)
  } catch (err) {
    console.error(err.message)
  }

  try {
    const product = await products.retrieve({ cod: TEST_CODICE })
    console.log('READ (by cod)', product)
  } catch (err) {
    console.error(err.message)
  }

  try {
    const deleted = await products.delete({ id })
    console.log('DELETE', deleted)
  } catch (err) {
    console.error(err.message)
  }
}

main()
