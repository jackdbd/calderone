<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/fattureincloud-client](./fattureincloud-client.md) &gt; [InvoiceCreateRequestBody](./fattureincloud-client.invoicecreaterequestbody.md)

## InvoiceCreateRequestBody interface

<b>Signature:</b>

```typescript
export interface CreateRequestBody 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [autocompila\_anagrafica\_cliente?](./fattureincloud-client.invoicecreaterequestbody.autocompila_anagrafica_cliente.md) |  | boolean | <i>(Optional)</i> |
|  [codice\_fiscale?](./fattureincloud-client.invoicecreaterequestbody.codice_fiscale.md) |  | string | <i>(Optional)</i> |
|  [codice\_sdi?](./fattureincloud-client.invoicecreaterequestbody.codice_sdi.md) |  | string | <i>(Optional)</i> |
|  [data\_emissione?](./fattureincloud-client.invoicecreaterequestbody.data_emissione.md) |  | string | <i>(Optional)</i> |
|  [email?](./fattureincloud-client.invoicecreaterequestbody.email.md) |  | string | <i>(Optional)</i> |
|  [id\_cliente?](./fattureincloud-client.invoicecreaterequestbody.id_cliente.md) |  | string | <i>(Optional)</i> |
|  [id\_fornitore?](./fattureincloud-client.invoicecreaterequestbody.id_fornitore.md) |  | string | <i>(Optional)</i> |
|  [indirizzo\_cap?](./fattureincloud-client.invoicecreaterequestbody.indirizzo_cap.md) |  | string | <i>(Optional)</i> |
|  [indirizzo\_citta?](./fattureincloud-client.invoicecreaterequestbody.indirizzo_citta.md) |  | string | <i>(Optional)</i> |
|  [indirizzo\_extra?](./fattureincloud-client.invoicecreaterequestbody.indirizzo_extra.md) |  | string | <i>(Optional)</i> |
|  [indirizzo\_provincia?](./fattureincloud-client.invoicecreaterequestbody.indirizzo_provincia.md) |  | string | <i>(Optional)</i> |
|  [indirizzo\_via?](./fattureincloud-client.invoicecreaterequestbody.indirizzo_via.md) |  | string | <i>(Optional)</i> |
|  [is\_fattura\_elettronica?](./fattureincloud-client.invoicecreaterequestbody.is_fattura_elettronica.md) |  | boolean | <i>(Optional)</i> |
|  [is\_pubblica\_amministrazione?](./fattureincloud-client.invoicecreaterequestbody.is_pubblica_amministrazione.md) |  | boolean | <i>(Optional)</i> |
|  [is\_split\_payment?](./fattureincloud-client.invoicecreaterequestbody.is_split_payment.md) |  | boolean | <i>(Optional)</i> |
|  [lingua?](./fattureincloud-client.invoicecreaterequestbody.lingua.md) |  | string | <i>(Optional)</i> |
|  [lista\_articoli](./fattureincloud-client.invoicecreaterequestbody.lista_articoli.md) |  | [Articolo](./fattureincloud-client.invoicearticle.md)<!-- -->\[\] |  |
|  [lista\_pagamenti?](./fattureincloud-client.invoicecreaterequestbody.lista_pagamenti.md) |  | [Pagamento](./fattureincloud-client.invoicepayment.md)<!-- -->\[\] | <i>(Optional)</i> |
|  [marca\_bollo?](./fattureincloud-client.invoicecreaterequestbody.marca_bollo.md) |  | number | <i>(Optional)</i> |
|  [metodo\_pagamento?](./fattureincloud-client.invoicecreaterequestbody.metodo_pagamento.md) |  | string | <i>(Optional)</i> |
|  [mostra\_bottone\_paypal?](./fattureincloud-client.invoicecreaterequestbody.mostra_bottone_paypal.md) |  | boolean | <i>(Optional)</i> |
|  [mostra\_info\_pagamento?](./fattureincloud-client.invoicecreaterequestbody.mostra_info_pagamento.md) |  | boolean | <i>(Optional)</i> |
|  [nota\_html?](./fattureincloud-client.invoicecreaterequestbody.nota_html.md) |  | string | <i>(Optional)</i> |
|  [numero?](./fattureincloud-client.invoicecreaterequestbody.numero.md) |  | string | <i>(Optional)</i> Numero e serie della fattura. Ad esempio 1234FE, 9999TEST ATTENZIONE: questo numero deve rispettare la numerazione progressiva adottata dall'azienda che emette la fattura. Se mancante viene utilizzato il successivo proposto per la serie principale; se viene specificata solo la serie (stringa che inizia con un carattere non numerico) viene utilizzato il successivo per quella serie. Conviene specificare solo la serie, cosi' alla numerazione progressiva ci pensa la API di FattureInCloud. |
|  [paese\_iso?](./fattureincloud-client.invoicecreaterequestbody.paese_iso.md) |  | string | <i>(Optional)</i> |
|  [paese?](./fattureincloud-client.invoicecreaterequestbody.paese.md) |  | string | <i>(Optional)</i> |
|  [partita\_iva?](./fattureincloud-client.invoicecreaterequestbody.partita_iva.md) |  | string | <i>(Optional)</i> |
|  [pec?](./fattureincloud-client.invoicecreaterequestbody.pec.md) |  | string | <i>(Optional)</i> |
|  [prezzi\_ivati?](./fattureincloud-client.invoicecreaterequestbody.prezzi_ivati.md) |  | boolean | <i>(Optional)</i> |
|  [ragione\_sociale](./fattureincloud-client.invoicecreaterequestbody.ragione_sociale.md) |  | string |  |
|  [salva\_anagrafica\_cliente?](./fattureincloud-client.invoicecreaterequestbody.salva_anagrafica_cliente.md) |  | boolean | <i>(Optional)</i> |
|  [tel?](./fattureincloud-client.invoicecreaterequestbody.tel.md) |  | string | <i>(Optional)</i> |
|  [valuta?](./fattureincloud-client.invoicecreaterequestbody.valuta.md) |  | string | <i>(Optional)</i> |

