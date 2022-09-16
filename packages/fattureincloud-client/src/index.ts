/**
 * Entry point for the documentation of fattureincloud-client.
 *
 * @packageDocumentation
 */

export { basicClient, rateLimitedClient } from './clients.js'
export type { Client } from './clients.js'

export type { Credentials } from './interfaces.js'

export type { Client as CustomersClient } from './customers/clients.js'
export type { ListResponseBody as CustomerListResponseBody } from './customers/api.js'
export type {
  Customer,
  ListOptions as CustomerListOptions,
  RetrieveConfig as CustomerRetrieveConfig,
  CreateRequestBody as CustomerCreateRequestBody,
  UpdateRequestBody as CustomerUpdateRequestBody,
  DeleteRequestBody as CustomerDeleteRequestBody,
  APIResponseBodyList as CustomerAPIResponseBodyList,
  APIResponseBodyCreate as CustomerAPIResponseBodyCreate,
  APIResponseBodyUpdate as CustomerAPIResponseBodyUpdate,
  APIResponseBodyDelete as CustomerAPIResponseBodyDelete
} from './customers/interfaces.js'

export type { Client as InfoClient } from './info/clients.js'
export type { AccountResponseBody as InfoAccountResponseBody } from './info/api.js'
export type {
  AccountOptions as InfoAccountOptions,
  Conto as InfoAccount,
  Iva as InfoVat,
  Valuta as InfoCurrency
} from './info/interfaces.js'

export type { Client as InvoicesClient } from './invoices/clients.js'
export type { ListResponseBody as InvoiceListResponseBody } from './invoices/api.js'
export type {
  Articolo as InvoiceArticle,
  Pagamento as InvoicePayment,
  RiassuntoFattura as InvoiceSummary,
  DettaglioFattura as InvoiceDetail,
  CreateRequestBody as InvoiceCreateRequestBody,
  ListOptions as InvoiceListOptions,
  RetrieveConfig as InvoiceRetrieveConfig,
  DeleteRequestBody as InvoiceDeleteRequestBody,
  DataValidation as InvoiceDataValidation,
  APIResponseBodyCreate as InvoiceAPIResponseBodyCreate,
  APIResponseBodyDelete as InvoiceAPIResponseBodyDelete,
  APIResponseBodyDetail as InvoiceAPIResponseBodyDetail,
  APIResponseBodyList as InvoiceAPIResponseBodyList
} from './invoices/interfaces.js'

export type { Client as ProductsClient } from './products/clients.js'
export type { ListResponseBody as ProductListResponseBody } from './products/api.js'
export type {
  Product,
  ListOptions as ProductListOptions,
  RetrieveConfig as ProductRetrieveConfig,
  CreateRequestBody as ProductCreateRequestBody,
  DeleteRequestBody as ProductDeleteRequestBody,
  APIResponseBodyCreate as ProductAPIResponseBodyCreate,
  APIResponseBodyList as ProductAPIResponseBodyList,
  APIResponseBodyUpdate as ProductAPIResponseBodyUpdate,
  APIResponseBodyDelete as ProductAPIResponseBodyDelete
} from './products/interfaces.js'
