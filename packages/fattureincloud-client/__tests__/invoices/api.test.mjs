import { listInvoices, retrieveInvoice } from '../../lib/invoices/api.js'
import { eitherYearOrDatesMustBeSet } from '../../lib/invoices/error-messages.js'
import { credentials } from '../api-credentials.mjs'

describe('listInvoices', () => {
  it('throws the expected error when passed an invalid API Key or an invalid API UID', async () => {
    const config = {}

    expect(
      listInvoices(
        {
          api_key: 'invalid-api-key',
          api_uid: 'invalid-api-uid'
        },
        config
      )
    ).rejects.toThrowError(eitherYearOrDatesMustBeSet)
  })

  it('returns the expected properties when passed a valid configuration', async () => {
    const config = { year: 2020 }

    const invoices = await listInvoices(credentials(), config)

    expect(invoices).toHaveProperty('current_page')
    expect(invoices).toHaveProperty('total_pages')
    expect(invoices).toHaveProperty('results')
  })
})

describe('retrieveInvoice', () => {
  it('returns the expected invoice', async () => {
    const config = { id: '117975756' }

    const invoice = await retrieveInvoice(credentials(), config)

    expect(invoice.id).toBe(config.id)
  })
})
