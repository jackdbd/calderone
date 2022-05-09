import makeDebug from 'debug'
import phin from 'phin'
import { isInteger } from '../checks.js'
import {
  canAutocompleteCustomerIfRequested,
  canSaveCustomerIfRequested,
  canShowMetodoDiPagamento,
  isArticoliValid
} from './checks.js'
import {
  articoliCannotBeEmpty,
  cannotAutocompleteCustomer,
  cannotSaveCustomer,
  cannotSetPecForPubblicaAmministrazione,
  eitherYearOrDatesMustBeSet,
  mostraInfoPagamentoNotSetToTrue
} from './error-messages.js'
import { newErrorFromApiError } from '../error.js'
import { headers } from '../headers.js'
import type { Credentials } from '../interfaces.js'
import type {
  APIResponseBodyCreate,
  APIResponseBodyDelete,
  APIResponseBodyDetail,
  APIResponseBodyList,
  CreateRequestBody,
  DeleteRequestBody,
  ListOptions,
  RetrieveConfig
} from './interfaces.js'

const debug = makeDebug('fattureincloud-client/invoices/api')

const API_ENDPOINT = 'https://api.fattureincloud.it/v1/fatture'

/**
 * Retrieve a paginated list of invoices.
 *
 * Each page can contain a maximum of 250 results. The FattureInCloud API does
 * not allow to configure how many results to return for each page.
 *
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Documenti_emessi/DocLista
 */
export const listInvoices = async (
  { api_key, api_uid }: Credentials,
  options?: ListOptions
) => {
  debug('list options (before validation and defaults) %O', options)

  const date_begin = options?.date_begin || ''
  const date_end = options?.date_end || ''
  const year = options?.year
  const page = options?.page || 1

  if (page < 1) {
    throw new Error(`page must be >= 1`)
  }

  if (!isInteger(page)) {
    throw new Error(`page must be an integer`)
  }

  if (!year && (date_begin === '' || date_end === '')) {
    throw new Error(eitherYearOrDatesMustBeSet)
  }

  if (year) {
    if (year < 1) {
      throw new Error(`year must be >= 1`)
    }

    if (!isInteger(year)) {
      throw new Error(`year must be an integer`)
    }
  }

  debug('list options (after validation and defaults) %O', {
    page,
    date_begin,
    date_end,
    year
  })

  const response = await phin<APIResponseBodyList>({
    data: {
      api_key,
      api_uid,
      anno: year,
      data_inizio: date_begin,
      data_fine: date_end,
      pagina: page
    },
    headers: headers(),
    method: 'POST',
    parse: 'json' as const,
    url: `${API_ENDPOINT}/lista`
  })

  const b = response.body

  if (b.error) {
    throw newErrorFromApiError({ error: b.error, error_code: b.error_code! })
  }

  const current_page = b.pagina_corrente
  const total_pages = b.numero_pagine
  const results = b.lista_documenti
  const results_per_page = b.risultati_per_pagina
  const results_total = b.numero_risultati

  if (page > total_pages) {
    throw new Error(
      `[400] requested page > total pages (${page} > ${total_pages})`
    )
  }

  debug(
    `page ${current_page}/${total_pages}: ${results.length} invoices in this page`
  )
  return {
    current_page,
    results,
    results_per_page,
    results_total,
    total_pages
  }
}

/**
 * Retrieve a single invoice that matches the search criteria.
 *
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Documenti_emessi/DocDettagli
 */
export const retrieveInvoice = async (
  { api_key, api_uid }: Credentials,
  { id }: RetrieveConfig
) => {
  if (id === '') {
    throw new Error('id is not set')
  }

  debug(`retrieve invoice ${id}`)

  const response = await phin<APIResponseBodyDetail>({
    data: {
      api_key,
      api_uid,
      id
    },
    headers: headers(),
    method: 'POST',
    parse: 'json' as const,
    url: `${API_ENDPOINT}/dettagli`
  })

  const b = response.body

  if (b.error) {
    throw newErrorFromApiError({ error: b.error, error_code: b.error_code! })
  }

  return b.dettagli_documento
}

/**
 * Create a new invoice.
 *
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Documenti_emessi/DocNuovo
 */
export const createInvoice = async (
  { api_key, api_uid }: Credentials,
  {
    autocompila_anagrafica_cliente = false,
    codice_fiscale,
    codice_sdi,
    data_emissione,
    email,
    id_cliente,
    id_fornitore,
    indirizzo_via,
    indirizzo_extra,
    indirizzo_cap,
    indirizzo_citta,
    indirizzo_provincia,
    is_fattura_elettronica,
    is_pubblica_amministrazione = false,
    is_split_payment = false,
    lingua = 'it',
    lista_articoli,
    lista_pagamenti,
    marca_bollo,
    metodo_pagamento,
    mostra_bottone_paypal,
    mostra_info_pagamento,
    nota_html,
    numero,
    paese,
    paese_iso,
    partita_iva,
    pec,
    prezzi_ivati,
    ragione_sociale,
    salva_anagrafica_cliente,
    tel,
    valuta = 'EUR'
  }: CreateRequestBody
) => {
  debug('create invoice')

  // input validation ===================================================== //
  if (!isArticoliValid(lista_articoli)) {
    throw new Error(`[400] ${articoliCannotBeEmpty}`)
  }

  if (
    !canAutocompleteCustomerIfRequested({
      autocompila_anagrafica_cliente,
      codice_fiscale,
      id_cliente,
      partita_iva
    })
  ) {
    throw new Error(`[400] ${cannotAutocompleteCustomer}`)
  }

  if (!canSaveCustomerIfRequested({ email, salva_anagrafica_cliente, tel })) {
    throw new Error(`[400] ${cannotSaveCustomer}`)
  }

  if (
    !canShowMetodoDiPagamento({
      metodo_pagamento,
      mostra_info_pagamento
    })
  ) {
    throw new Error(`[400] ${mostraInfoPagamentoNotSetToTrue}`)
  }

  if (is_pubblica_amministrazione && pec) {
    throw new Error(`[400] ${cannotSetPecForPubblicaAmministrazione}`)
  }
  // ======================================================================== //

  const PA_tipo_cliente = is_pubblica_amministrazione ? 'PA' : 'B2B'

  const response = await phin<APIResponseBodyCreate>({
    data: {
      api_key,
      api_uid,
      autocompila_anagrafica: autocompila_anagrafica_cliente,
      // cassa,
      // centro_costo,
      // centro_ricavo,
      cf: codice_fiscale,
      data: data_emissione,
      // ddt,
      // ddt_id_template,
      extra_anagrafica: {
        mail: email,
        tel
      },
      // ftacc,
      // ftacc_id_template,
      id_cliente,
      id_fornitore,
      // id_template,
      // imponibile_ritenuta,
      indirizzo_via,
      indirizzo_extra,
      indirizzo_cap,
      indirizzo_citta,
      indirizzo_provincia,
      is_fattura_elettronica,
      is_split_payment,
      lingua,
      lista_articoli,
      lista_pagamenti,
      marca_bollo,
      // metodo_desc1: 'descrizione metodo pagamento 1',
      // ...
      // metodo_desc5: 'descrizione metodo pagamento 5',
      metodo_pagamento,
      // metodo_titolo1: 'titolo del metodo di pagamento 1',
      // ...
      // metodo_titolo5: 'titolo del metodo di pagamento 5',
      mostra_bottone_paypal,
      mostra_info_pagamento,
      // nascondi_scadenza,
      nome: ragione_sociale,
      note: nota_html,
      numero,
      // oggetto_interno,
      // oggetto_visibile,
      paese,
      paese_iso,
      PA: is_fattura_elettronica,
      PA_codice: codice_sdi,
      PA_pec: pec,
      PA_tipo_cliente,
      piva: partita_iva,
      prezzi_ivati, // TODO: rinomina in is_prezzo_lordo
      // rit_acconto,
      // rit_altra,
      // rivalsa,
      salva_anagrafica: salva_anagrafica_cliente,
      valuta
    },
    headers: headers(),
    method: 'POST',
    parse: 'json' as const,
    url: `${API_ENDPOINT}/nuovo`
  })

  const b = response.body

  if (b.error) {
    throw newErrorFromApiError({ error: b.error, error_code: b.error_code! })
  }

  return { id: b.new_id, token: b.token }
}

/**
 * Delete an invoice.
 *
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Documenti_emessi/DocElimina
 */
export const deleteInvoice = async (
  { api_key, api_uid }: Credentials,
  { id }: DeleteRequestBody
) => {
  debug(`delete invoice id ${id}`)

  const response = await phin<APIResponseBodyDelete>({
    data: {
      api_key,
      api_uid,
      id
    },
    headers: headers(),
    method: 'POST',
    parse: 'json' as const,
    url: `${API_ENDPOINT}/elimina`
  })

  const b = response.body

  if (b.error) {
    throw newErrorFromApiError({ error: b.error, error_code: b.error_code! })
  }

  return { id }
}

/**
 * Autopaginate results.
 */
export async function* listInvoicesAsyncGenerator(
  credentials: Credentials,
  options?: ListOptions
) {
  const start = options?.page || 1
  let stop = start + 1

  for (let page = start; page <= stop; page++) {
    const value = await listInvoices(credentials, { ...options, page })
    stop = value.total_pages
    yield value
  }
}
