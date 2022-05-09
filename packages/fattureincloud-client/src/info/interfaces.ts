import type { APIResponseBodyError } from '../interfaces.js'

export interface Conto {
  id: number
  nome_conto: string
}

export interface Iva {
  id: number
  cod_iva: string
  descrizione_iva: string
  valore_iva: string
}

export interface Template {
  id: number
  nome_template: string
}

export interface Valuta {
  cambio: string
  codice: string
  simbolo: string
}

export interface AccountOptions {
  fields?: string[]
}

// responses from the FattureInCloud API ==================================== //

export interface APIResponseBodyAccountInfo extends APIResponseBodyError {
  durata_licenza: number
  error: any
  lista_conti?: Conto[]
  lista_iva?: Iva[]
  lista_template?: Template[]
  lista_template_ddt?: Template[]
  lista_template_ftacc?: Template[]
  lista_valute?: Valuta[]
  nome: string
  success: boolean
  tipo_licenza: string
}
