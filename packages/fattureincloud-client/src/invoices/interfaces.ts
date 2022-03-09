import type { APIResponseBodyError } from "../interfaces.js";

export interface Articolo {
  applica_ra_contributi?: boolean;
  categoria?: string;
  cod_iva: string;
  codice?: string;
  desc_iva?: string;
  descrizione?: string;
  id?: string;
  in_ddt?: boolean;
  nome: string;
  ordine?: string;
  prezzo_lordo?: number;
  prezzo_netto?: number;
  quantita?: number;
  sconto?: number;
  sconto_rosso?: boolean;
  tassabile?: boolean;
  um?: string;
  valore_iva?: string;
}

export interface Pagamento {
  data_saldo?: string;
  data_scadenza: string;
  importo: number;
  metodo: string;
}

export interface RiassuntoFattura {
  data: string;
  ddt: boolean;
  ftacc: boolean;
  id: string;
  id_cliente: string | null;
  importo_netto: string;
  importo_totale: string;
  link_doc: string;
  nome: string;
  numero: string;
  PA: boolean;
  PA_tipo_cliente: "B2B" | "PA";
  prossima_scadenza: string;
  tipo: string;
  token: string;
  valuta: string;
  valuta_cambio: string;
}

export interface DettaglioFattura extends RiassuntoFattura {
  anno_competenza: string;
  bloccato: boolean;
  cassa: number;
  centro_ricavo: string;
  cf: string;
  ddt: boolean;
  id_template: string;
  imponibile_ritenuta: number;
  importo_cassa: string;
  importo_iva: string;
  importo_rit_acconto: string;
  importo_rit_altra: string;
  importo_rivalsa: string;
  indirizzo_cap: string;
  indirizzo_citta: string;
  indirizzo_extra: string;
  indirizzo_provincia: string;
  indirizzo_via: string;
  lingua: string;
  lista_articoli: Articolo[];
  lista_pagamenti: Pagamento[];
  marca_bollo: string;
  mostra_bottone_bonifico: boolean;
  mostra_bottone_notifica: boolean;
  mostra_bottone_paypal: boolean;
  mostra_bottone_ts_pay: boolean;
  mostra_info_pagamento: boolean;
  oggetto_fattura: string;
  oggetto_interno: string;
  oggetto_visibile: string;
  nascondi_scadenza: boolean;
  note: string;
  PA_beneficiario: string;
  PA_codice: string;
  PA_data: string;
  PA_esigibilita: string;
  PA_iban: string;
  PA_istituto_credito: string;
  PA_modalita_pagamento: string;
  PA_numero: string;
  PA_pec: string;
  PA_tipo: string;
  PA_ts: boolean;
  paese: string;
  piva: string;
  prezzi_ivati: boolean;
  rit_acconto: number;
  rivalsa: number;
  rit_altra: number;
}

export interface CreateRequestBody {
  autocompila_anagrafica_cliente?: boolean;
  // cassa
  codice_fiscale?: string;
  codice_sdi?: string;
  data_emissione?: string;
  email?: string;
  // ftacc = true // forse utile per includere la fattura di Stripe?
  id_cliente?: string;
  id_fornitore?: string;
  // imponibile_ritenuta
  indirizzo_cap?: string;
  indirizzo_citta?: string;
  indirizzo_extra?: string; // TODO: lo uso per scrivere address_line2?
  indirizzo_provincia?: string;
  indirizzo_via?: string;
  is_fattura_elettronica?: boolean;
  is_pubblica_amministrazione?: boolean;
  is_split_payment?: boolean;
  lingua?: string;
  lista_articoli: Articolo[];
  lista_pagamenti?: Pagamento[];
  marca_bollo?: number;
  // Nome del metodo di pagamento. Solo se mostra_info_pagamento=true.
  metodo_pagamento?: string;
  mostra_bottone_paypal?: boolean;
  mostra_info_pagamento?: boolean;
  nota_html?: string;
  /**
   * Numero e serie della fattura. Ad esempio 1234FE, 9999TEST
   * ATTENZIONE: questo numero deve rispettare la numerazione progressiva
   * adottata dall'azienda che emette la fattura. Se mancante viene utilizzato
   * il successivo proposto per la serie principale; se viene specificata solo
   * la serie (stringa che inizia con un carattere non numerico) viene
   * utilizzato il successivo per quella serie. Conviene specificare solo la
   * serie, cosi' alla numerazione progressiva ci pensa la API di FattureInCloud.
   */
  numero?: string;
  paese?: string;
  // country code 2 characters, in alternativa a `paese`
  paese_iso?: string;
  partita_iva?: string;
  pec?: string;
  prezzi_ivati?: boolean;
  ragione_sociale: string;
  // rit_acconto
  // rit_altra
  // rivalsa
  salva_anagrafica_cliente?: boolean;
  tel?: string;
  valuta?: string;
}

export interface ListOptions {
  // e.g. 31/12/2021
  date_begin?: string;
  date_end?: string;
  page?: number;
  substring_ragione_sociale?: string;
  year?: number;
}

export interface RetrieveConfig {
  id?: string;
}

export interface DataValidation {
  autocompila_anagrafica_cliente?: boolean;
  codice_fiscale?: string;
  email?: string;
  id_cliente?: string;
  metodo_pagamento?: string;
  mostra_info_pagamento?: boolean;
  partita_iva?: string;
  salva_anagrafica_cliente?: boolean;
  tel?: string;
}

export interface DeleteRequestBody {
  id: string;
}

// responses from the FattureInCloud API ==================================== //

export interface APIResponseBodyList extends APIResponseBodyError {
  lista_documenti: RiassuntoFattura[];
  numero_pagine: number;
  numero_risultati: number;
  pagina_corrente: number;
  risultati_per_pagina: number;
  success: boolean;
}

export interface APIResponseBodyCreate extends APIResponseBodyError {
  new_id: string;
  success: boolean;
  token: string;
}

export interface APIResponseBodyDelete extends APIResponseBodyError {
  success: boolean;
}

export interface APIResponseBodyDetail extends Partial<APIResponseBodyError> {
  dettagli_documento: DettaglioFattura;
  success: boolean;
}
