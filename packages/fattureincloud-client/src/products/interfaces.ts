import type { APIResponseBodyError } from '../interfaces.js'

export interface Product {
  categoria: string
  cod: string
  costo: string
  desc: string
  desc_iva: string
  giacenza_iniziale?: number
  id: string
  magazzino: boolean
  nome: string
  note: string
  prezzo_ivato: boolean
  prezzo_lordo?: string
  prezzo_netto: string
  um: string
  valore_iva: string
}

export interface ListOptions {
  categoria?: string
  cod?: string
  nome?: string
  page?: number
}

export interface RetrieveConfig {
  categoria?: string
  cod?: string
  id?: string
  nome?: string
}

export interface CreateRequestBody {
  categoria?: string
  cod?: string
  cod_iva?: string
  desc?: string
  desc_iva?: string
  giacenza_iniziale?: number
  magazzino?: boolean
  nome: string
  note?: string
  prezzo_ivato?: boolean
  prezzo_lordo?: number
  prezzo_netto?: number
  um?: string
}

export interface DeleteRequestBody {
  id: string
}

// responses from the FattureInCloud API ==================================== //

export interface APIResponseBodyList extends APIResponseBodyError {
  lista_prodotti: Product[]
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
