import { env } from 'process'
import { basicClient } from '../lib/invoices/clients.js'

const TEST_RAGIONE_SOCIALE = 'TEST COMPANY LTD of John Doe'
const TEST_CODICE_FISCALE = 'XYZABC84D20G628W'
const TEST_CODICE_SDI = '0000000'
const TEST_PARTITA_IVA = '12345678901'
const TEST_EMAIL = 'john@doe.com'
const TEST_PHONE = '+39 320 000 8888'
const TEST_INDIRIZZO_VIA = 'Via XYZ, 123'
const TEST_INDIRIZZO_EXTRA = `Qui c'è l'indirizzo extra`
const TEST_INDIRIZZO_CAP = '55049'
const TEST_INDIRIZZO_CITTA = 'Viareggio'
const TEST_INDIRIZZO_PROVINCIA = 'LU'
const TEST_METODO_PAGAMENTO = 'SOLDI DEL MONOPOLI'

const nowAndPastUTC = (n) => {
  const now = new Date().toISOString()
  const date_utc = new Date(now)
  date_utc.setUTCDate(date_utc.getUTCDate() - n)
  return { past: date_utc.toISOString(), now }
}

// const shouldHighlightScontoInRed = true
// const sconto_rosso = shouldHighlightScontoInRed ? 1 : 0

const articolo1 = {
  categoria: 'FORMAZIONE',
  cod_iva: '0',
  // cod_iva: '4'
  descrizione: 'Descrizione del Prodotto A',
  // id // id prodotto in FattureInCloud
  nome: 'Prodotto A',
  // prezzo_lordo
  prezzo_netto: 11.22,
  quantita: 2.0,
  sconto: 50.0
  // um
}

const articolo2 = {
  cod_iva: '4',
  descrizione: 'Descrizione del Prodotto B',
  nome: 'Prodotto B',
  prezzo_netto: 10.5
}

const lista_articoli = [articolo1, articolo2]

const data_scadenza = '31/03/2022'

const pagamento1 = {
  data_scadenza,
  importo: 24.61,
  // 'not' indica che il pagamento non è stato saldato
  metodo: 'not'
}

// const pagamento2 = {
//   data_scadenza,
//   importo: 10.0,
//   //'rev' indica che il pagamento è stato stornato (i.e. l'azienda ha
//   // ritornato questo importo al cliente)
//   metodo: 'rev'
// }

// const pagamento3 = {
//   data_saldo: '17/09/2021',
//   data_scadenza,
//   importo: 4.0,
//   metodo: 'Stripe'
// }

const lista_pagamenti = [pagamento1]

const nota_html =
  '<span>Nota in <i>corsivo</i> e <b>grassetto</b> perché supporta <code>codice HTML</code>.<br>Si può anche andare a capo.</span>'

const date_format_options = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
}

const main = async () => {
  const invoices = basicClient({
    api_key: env.FATTURE_IN_CLOUD_API_KEY,
    api_uid: env.FATTURE_IN_CLOUD_API_UID
  })

  const { past, now } = nowAndPastUTC(10)

  const d = new Date(now)

  const data_emissione = d.toLocaleDateString('it-IT', date_format_options)

  const date_begin = new Date(past).toLocaleDateString(
    'it-IT',
    date_format_options
  )
  const ts = d.getTime().toString() // timestamp
  const numero_progressivo = ts.slice(ts.length - 4, ts.length)
  const serie = 'TEST'
  const numero = `${numero_progressivo}${serie}`

  const year = d.getFullYear()

  let id
  let token
  try {
    const res = await invoices.create({
      codice_fiscale: TEST_CODICE_FISCALE,
      codice_sdi: TEST_CODICE_SDI,
      data_emissione,
      email: TEST_EMAIL,
      indirizzo_via: TEST_INDIRIZZO_VIA,
      indirizzo_extra: TEST_INDIRIZZO_EXTRA,
      indirizzo_cap: TEST_INDIRIZZO_CAP,
      indirizzo_citta: TEST_INDIRIZZO_CITTA,
      indirizzo_provincia: TEST_INDIRIZZO_PROVINCIA,
      is_fattura_elettronica: true,
      // lingua: 'de',
      lista_articoli,
      lista_pagamenti,
      metodo_pagamento: TEST_METODO_PAGAMENTO,
      mostra_info_pagamento: true,
      nota_html,
      // in una vera applicazione vuoi usare solo la serie (e.g. FE). In questo
      // modo alla numerazione progressiva ci pensa la API di FattureInCloud.
      numero,
      partita_iva: TEST_PARTITA_IVA,
      ragione_sociale: TEST_RAGIONE_SOCIALE,
      salva_anagrafica_cliente: false,
      // split_payment: true,
      tel: TEST_PHONE
      // valuta: 'USD',
    })

    id = res.id
    token = res.token
    console.log(`CREATED invoice id ${id} (token: ${token})`)
  } catch (err) {
    console.error(err.message)
    return
  }

  try {
    const date_end = data_emissione
    const paginated = await invoices.list({
      date_begin,
      date_end
    })
    console.log(
      `page ${paginated.current_page}/${paginated.total_pages} has ${paginated.results.length} invoices (date_begin ${date_begin} - date_end ${date_end})`
    )
  } catch (err) {
    console.error(err.message)
  }

  try {
    const paginated = await invoices.list({
      year
    })
    console.log(
      `page ${paginated.current_page}/${paginated.total_pages} has ${paginated.results.length} invoices (year ${year})`
    )
  } catch (err) {
    console.error(err.message)
  }

  try {
    const invoice = await invoices.retrieve({
      id
    })
    console.log(`invoice ${id}`, invoice)
  } catch (err) {
    console.error(err.message)
  }

  try {
    const deleted = await invoices.delete({
      id
    })
    console.log(`invoice deleted`, deleted)
  } catch (err) {
    console.error(err.message)
  }
}

main()
