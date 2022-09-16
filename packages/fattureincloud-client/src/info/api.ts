import makeDebug from 'debug'
import phin from 'phin'
import { newErrorFromApiError } from '../error.js'
import { headers } from '../headers.js'
import type { Credentials } from '../interfaces.js'
import type {
  AccountOptions,
  APIResponseBodyAccountInfo,
  Conto,
  Iva,
  Valuta
} from './interfaces.js'

const debug = makeDebug('fattureincloud-client/info/api')

const API_ENDPOINT = 'https://api.fattureincloud.it/v1/info'

export interface AccountResponseBody {
  success: true
  giorni_rimanenti_licenza?: number
  ragione_sociale?: string
  piano_licenza?: string
  lista_conti?: Conto[]
  lista_iva?: Iva[]
  lista_valute?: Valuta[]
}

/**
 * Returns info about a FattureinCloud account.
 *
 * @see [Informazioni e liste di diversa natura - FattureinCloud.it](https://api.fattureincloud.it/v1/documentation/dist/#!/Info/InfoLista)
 * @public
 */
export const account = async (
  { api_key, api_uid }: Credentials,
  options?: AccountOptions
) => {
  const campi = options?.fields || ['durata_licenza', 'nome', 'tipo_licenza']

  debug('list options (after validation and defaults) %O', { campi })

  const response = await phin<APIResponseBodyAccountInfo>({
    data: {
      api_key,
      api_uid,
      campi
    },
    headers: headers(),
    method: 'POST',
    parse: 'json' as const,
    url: `${API_ENDPOINT}/account`
  })

  const b = response.body

  if (b.error) {
    throw newErrorFromApiError({ error: b.error, error_code: b.error_code! })
  }

  const response_body: AccountResponseBody = { success: true } // TODO better type

  if (campi.includes('durata_licenza')) {
    response_body.giorni_rimanenti_licenza = b.durata_licenza
  }
  if (campi.includes('nome')) {
    response_body.ragione_sociale = b.nome
  }
  if (campi.includes('tipo_licenza')) {
    response_body.piano_licenza = b.tipo_licenza
  }
  if (campi.includes('lista_conti')) {
    response_body.lista_conti = b.lista_conti
  }
  if (campi.includes('lista_iva')) {
    response_body.lista_iva = b.lista_iva
  }
  if (campi.includes('lista_valute')) {
    response_body.lista_valute = b.lista_valute
  }

  // const {
  //   lista_template,
  //   lista_template_ddt,
  //   lista_template_ftacc,
  // } = response.body

  // return {
  //   giorni_rimanenti_licenza: durata_licenza,
  //   lista_conti: lista_conti || [],
  //   lista_iva: lista_iva || [],
  //   lista_template: {
  //     generic: lista_template || [],
  //     ddt: lista_template_ddt || [],
  //     ftacc: lista_template_ftacc || []
  //   },
  //   lista_valute: lista_valute || [],
  //   piano_licenza: tipo_licenza,
  //   ragione_sociale: nome,
  //   status_code: 200
  // }

  return response_body
}
