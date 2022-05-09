import type { APIResponseBodyError } from '../interfaces.js'

export interface Customer {
  cf: string
  desc_iva_default: string
  extra: string
  fax: string
  id: string
  indirizzo_cap: string
  indirizzo_citta: string
  indirizzo_extra: string
  indirizzo_provincia: string
  indirizzo_via: string
  mail: string
  nome: string
  PA: boolean
  PA_codice: string
  paese: string
  pagamento_fine_mese: boolean
  pec: string
  piva: string
  referente: string
  tel: string
  termini_pagamento: string
  val_iva_default: string
}

export interface ListOptions {
  codice_fiscale?: string
  name?: string
  page?: number
  partita_iva?: string
}

export interface RetrieveConfig {
  codice_fiscale?: string
  id?: string
  partita_iva?: string
}

export interface CreateRequestBody {
  codice_fiscale?: string
  codice_sdi?: string
  descrizione_iva_default?: string
  email?: string
  fax?: string
  indirizzo_cap?: string
  indirizzo_citta?: string
  indirizzo_extra?: string
  indirizzo_provincia?: string
  indirizzo_via?: string
  is_pagamento_fine_mese?: boolean
  is_pubblica_amministrazione?: boolean
  note_extra?: string
  paese?: string
  paese_iso?: string
  partita_iva?: string
  ragione_sociale?: string
  referente?: string
  tel?: string
  termini_pagamento?: number
  valore_iva_default?: string
}

export interface UpdateRequestBody extends CreateRequestBody {
  id: string
}

export interface DeleteRequestBody {
  id: string
}

// responses from the FattureInCloud API ==================================== //

export interface APIResponseBodyList extends APIResponseBodyError {
  lista_clienti: Customer[]
  numero_pagine: number
  pagina_corrente: number
  success: boolean
}

export interface APIResponseBodyCreate extends APIResponseBodyError {
  id: string
  success: boolean
}

export interface APIResponseBodyUpdate extends APIResponseBodyError {
  success: boolean
}

export interface APIResponseBodyDelete extends APIResponseBodyError {
  success: boolean
}
