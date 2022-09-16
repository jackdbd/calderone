import type { Articolo, DataValidation } from './interfaces.js'

// TODO: use Joi instead of these functions.

export const isArticoliValid = (lista_articoli?: Articolo[]) => {
  if (lista_articoli && lista_articoli.length > 0) {
    return true
  } else {
    return false
  }
}

export const canShowMetodoDiPagamento = ({
  metodo_pagamento,
  mostra_info_pagamento
}: DataValidation) => {
  if (metodo_pagamento && !mostra_info_pagamento) {
    return false
  } else {
    return true
  }
}

export const canAutocompleteCustomerIfRequested = ({
  id_cliente,
  codice_fiscale,
  autocompila_anagrafica_cliente,
  partita_iva
}: DataValidation) => {
  if (
    autocompila_anagrafica_cliente &&
    !(codice_fiscale || id_cliente || partita_iva)
  ) {
    return false
  } else {
    return true
  }
}

export const canSaveCustomerIfRequested = ({
  email,
  salva_anagrafica_cliente,
  tel
}: DataValidation) => {
  if (salva_anagrafica_cliente && !(email || tel)) {
    return false
  } else {
    return true
  }
}
