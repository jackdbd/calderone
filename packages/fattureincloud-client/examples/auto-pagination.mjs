import { env } from 'process'
import { basicClient } from '../lib/index.js'

const autopaginateCustomers = async (fic) => {
  const async_gen = fic.customers.listAsyncGenerator()

  for await (const v of async_gen) {
    const n = v.results.length
    console.log(
      `page ${v.current_page}/${v.total_pages}: retrieved ${n} customers`
    )
  }

  // find all customers that have `RN` in their codice_fiscale, and whose
  // `partita_iva` contains `01` (consecutive)
  const async_gen_with_options = fic.customers.listAsyncGenerator({
    codice_fiscale: 'RN',
    partita_iva: '01'
  })

  for await (const v of async_gen_with_options) {
    const n = v.results.length
    console.log(
      `page ${v.current_page}/${v.total_pages}: retrieved ${n} customers`
    )
  }
}

const autopaginateInvoices = async (fic) => {
  const async_gen = fic.invoices.listAsyncGenerator({ year: 2021 })

  for await (let {
    results,
    results_total,
    current_page,
    total_pages
  } of async_gen) {
    const n = results.length
    console.log(
      `page ${current_page}/${total_pages}: retrieved ${n} invoices (${results_total} total)`
    )
  }
}

const autopaginateProducts = async (fic) => {
  const async_gen = fic.products.listAsyncGenerator()

  for await (const v of async_gen) {
    const n = v.results.length
    console.log(
      `page ${v.current_page}/${v.total_pages}: retrieved ${n} products`
    )
  }

  const async_gen_with_options = fic.products.listAsyncGenerator({
    nome: 'manual'
  })

  for await (const v of async_gen_with_options) {
    const n = v.results.length
    console.log(
      `page ${v.current_page}/${v.total_pages}: retrieved ${n} products`
    )
  }
}

const main = async () => {
  const fic = basicClient({
    api_key: env.FATTURE_IN_CLOUD_API_KEY,
    api_uid: env.FATTURE_IN_CLOUD_API_UID
  })

  await autopaginateCustomers(fic)
  await autopaginateInvoices(fic)
  await autopaginateProducts(fic)
}

main()
