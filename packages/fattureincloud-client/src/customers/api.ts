import makeDebug from 'debug'
import phin from 'phin'
import { newErrorFromApiError } from '../error.js'
import { headers } from '../headers.js'
import type { Credentials } from '../interfaces.js'
import { isInteger } from '../checks.js'
import type {
  APIResponseBodyCreate,
  APIResponseBodyDelete,
  APIResponseBodyList,
  APIResponseBodyUpdate,
  CreateRequestBody,
  DeleteRequestBody,
  ListOptions,
  RetrieveConfig,
  UpdateRequestBody
} from './interfaces.js'

const debug = makeDebug('fattureincloud-client/customers/api')

const API_ENDPOINT = 'https://api.fattureincloud.it/v1/clienti'

/**
 * Retrieve a paginated list of customers.
 *
 * Each page can contain a maximum of 500 results. The FattureInCloud API does
 * not allow to configure how many results to return for each page.
 *
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Anagrafica/AnagraficaLista
 */
export const list = async (
  { api_key, api_uid }: Credentials,
  options?: ListOptions
) => {
  debug('list options (before validation and defaults) %O', options)

  const cf = options?.codice_fiscale || ''
  const piva = options?.partita_iva || ''
  const nome = options?.name || ''
  const page = options?.page || 1

  if (page < 1) {
    throw new Error(`page must be >= 1`)
  }

  if (!isInteger(page)) {
    throw new Error(`page must be an integer`)
  }

  if (cf.length > 16) {
    throw new Error(
      `the search string for codice_fiscale must be 16 characters or less`
    )
  }

  debug('list options (after validation and defaults) %O', { cf, page, piva })

  const response = await phin<APIResponseBodyList>({
    data: {
      api_key,
      api_uid,
      cf,
      nome,
      pagina: page,
      piva
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
  const results = b.lista_clienti

  if (page > total_pages) {
    throw new Error(
      `[400] requested page > total pages (${page} > ${total_pages})`
    )
  }

  debug(
    `page ${current_page}/${total_pages}: ${results.length} customers in this page`
  )

  return { results, current_page, total_pages }
}

/**
 * Retrieve a single customer that matches the search criteria.
 *
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Anagrafica/AnagraficaLista
 */
export const retrieve = async (
  { api_key, api_uid }: Credentials,
  { codice_fiscale, id, partita_iva }: RetrieveConfig
) => {
  const cf = codice_fiscale || ''
  const piva = partita_iva || ''
  const identifier = id || ''

  if (cf === '' && identifier === '' && piva === '') {
    throw new Error(
      'at least one between `codice_fiscale`, `id`, `partita_iva` must be set'
    )
  }

  const response = await phin<APIResponseBodyList>({
    data: {
      api_key,
      api_uid,
      cf: codice_fiscale,
      id: identifier,
      piva: partita_iva
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

  const search_criteria = {
    codice_fiscale: cf,
    id: identifier,
    partita_iva: piva
  }

  if (b.lista_clienti.length === 0) {
    throw new Error(
      `[${404}] Found no customer that matches search criteria '${JSON.stringify(
        search_criteria
      )}'`
    )
  }

  return b.lista_clienti[0]
}

/**
 * Create a new customer.
 *
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Anagrafica/AnagraficaNuovoSingolo
 */
export const create = async (
  { api_key, api_uid }: Credentials,
  {
    codice_fiscale,
    codice_sdi,
    email,
    indirizzo_cap,
    indirizzo_citta,
    indirizzo_extra,
    indirizzo_provincia,
    indirizzo_via,
    // is_pagamento_fine_mese,
    is_pubblica_amministrazione = false,
    note_extra,
    paese,
    paese_iso,
    partita_iva,
    ragione_sociale,
    referente,
    tel,
    termini_pagamento,
    valore_iva_default
  }: CreateRequestBody
) => {
  debug('create customer')

  // TODO: consider optional validation?

  const response = await phin<APIResponseBodyCreate>({
    data: {
      api_key,
      api_uid,
      cf: codice_fiscale,
      indirizzo_via,
      indirizzo_cap,
      indirizzo_citta,
      indirizzo_extra,
      indirizzo_provincia,
      mail: email,
      nome: ragione_sociale,
      note_extra,
      paese,
      paese_iso,
      piva: partita_iva,
      PA: is_pubblica_amministrazione,
      PA_codice: codice_sdi,
      referente,
      tel,
      termini_pagamento,
      valore_iva_default
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

  return { id: b.id }
}

/**
 * Update an existing customer.
 *
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Anagrafica/AnagraficaModifica
 */
export const update = async (
  { api_key, api_uid }: Credentials,
  {
    codice_fiscale,
    codice_sdi,
    email,
    id,
    indirizzo_cap,
    indirizzo_citta,
    indirizzo_extra,
    indirizzo_provincia,
    indirizzo_via,
    is_pubblica_amministrazione = false,
    note_extra,
    paese,
    paese_iso,
    partita_iva,
    ragione_sociale,
    referente,
    tel,
    termini_pagamento,
    valore_iva_default
  }: UpdateRequestBody
) => {
  debug(`update customer id ${id}`)

  const data: any = {
    api_key,
    api_uid,
    id
  }

  if (codice_fiscale) {
    data['cf'] = codice_fiscale
  }
  if (codice_sdi) {
    data['PA_codice'] = codice_sdi
  }
  if (email) {
    data['mail'] = email
  }
  if (indirizzo_cap) {
    data['indirizzo_cap'] = indirizzo_cap
  }
  if (indirizzo_citta) {
    data['indirizzo_citta'] = indirizzo_citta
  }
  if (indirizzo_provincia) {
    data['indirizzo_provincia'] = indirizzo_provincia
  }
  if (indirizzo_via) {
    data['indirizzo_via'] = indirizzo_via
  }
  if (ragione_sociale) {
    data['nome'] = ragione_sociale
  }
  if (note_extra) {
    data['extra'] = note_extra
  }
  if (indirizzo_extra) {
    data['indirizzo_extra'] = indirizzo_extra
  }
  if (paese) {
    data['paese'] = paese
  }
  if (paese_iso) {
    data['paese_iso'] = paese_iso
  }
  if (tel) {
    data['tel'] = tel
  }
  if (partita_iva) {
    data['piva'] = partita_iva
  }
  if (referente) {
    data['referente'] = referente
  }
  if (is_pubblica_amministrazione) {
    data['PA'] = is_pubblica_amministrazione
  }
  if (termini_pagamento) {
    data['termini_pagamento'] = termini_pagamento
  }
  if (valore_iva_default) {
    data['val_iva_default'] = valore_iva_default
  }

  debug('update patch (right before call to /modifica) %O', data)

  const response = await phin<APIResponseBodyUpdate>({
    data,
    headers: headers(),
    method: 'POST',
    url: `${API_ENDPOINT}/modifica`,
    followRedirects: true,
    parse: 'json'
  })

  const b = response.body

  debug('response body (right after call to /modifica) %O', b)
  if (b.error) {
    const err = newErrorFromApiError({
      error: b.error,
      error_code: b.error_code!
    })
    throw err
  }

  const campi = []
  if (ragione_sociale) {
    campi.push('nome')
  }
  if (referente) {
    campi.push('referente')
  }
  if (indirizzo_via) {
    campi.push('indirizzo_via')
  }
  if (indirizzo_cap) {
    campi.push('indirizzo_cap')
  }
  if (indirizzo_citta) {
    campi.push('indirizzo_citta')
  }
  if (indirizzo_provincia) {
    campi.push('indirizzo_provincia')
  }
  if (note_extra) {
    campi.push('extra')
  }
  if (indirizzo_extra) {
    campi.push('indirizzo_extra')
  }
  if (paese) {
    campi.push('paese')
  }
  if (paese_iso) {
    campi.push('paese_iso')
  }
  if (email) {
    campi.push('mail')
  }
  if (tel) {
    campi.push('tel')
  }
  if (partita_iva) {
    campi.push('piva')
  }
  if (codice_fiscale) {
    campi.push('cf')
  }
  if (is_pubblica_amministrazione) {
    campi.push('PA')
  }
  if (codice_sdi) {
    campi.push('PA_codice')
  }
  if (termini_pagamento) {
    campi.push('termini_pagamento')
  }
  if (valore_iva_default) {
    campi.push('val_iva_default')
  }

  return { id, campi }
}

/**
 * Delete a customer.
 *
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Anagrafica/AnagraficaElimina
 */
export const deleteCustomer = async (
  { api_key, api_uid }: Credentials,
  { id }: DeleteRequestBody
) => {
  debug(`delete customer id ${id}`)

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
export async function* listAsyncGenerator(
  credentials: Credentials,
  options?: ListOptions
) {
  const start = options?.page || 1
  let stop = start + 1

  for (let page = start; page <= stop; page++) {
    const value = await list(credentials, { ...options, page })
    stop = value.total_pages
    yield value
  }
}
