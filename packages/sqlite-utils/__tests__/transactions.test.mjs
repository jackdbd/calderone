import { bulkInsert } from '../lib/transactions.js'
import { sqliteDatabase, DDL, QUERY } from './utils.mjs'

describe('bulkInsert', () => {
  let db

  beforeEach(() => {
    db = sqliteDatabase()
    db.exec(DDL.CREATE_TABLE_CUSTOMER)
    db.exec(DDL.CREATE_TABLE_PRODUCT)

    // this is not required, but it's better to be explicit in tests
    db.pragma('foreign_keys = ON')

    db.exec(DDL.CREATE_TABLE_INVOICE)
  })

  it('returns a transaction function', () => {
    const transaction = bulkInsert({ db, insert_query: QUERY.INSERT_CUSTOMER })

    expect(transaction).toBeDefined()
  })

  it('when the transaction function is called, it returns a message', () => {
    const transaction = bulkInsert({ db, insert_query: QUERY.INSERT_CUSTOMER })

    expect(transaction).toBeDefined()

    const customers = [{ name: 'John Foo' }, { name: 'Jane Bar' }]

    const result = transaction(customers)
    expect(result).toBeDefined()
    expect(result.message).toBeDefined()
  })

  it('when the transaction function is called with 2 records, it returns `records_inserted=2`', () => {
    const transaction = bulkInsert({ db, insert_query: QUERY.INSERT_CUSTOMER })

    expect(transaction).toBeDefined()

    const customers = [{ name: 'John Foo' }, { name: 'Jane Bar' }]

    const result = transaction(customers)
    expect(result).toBeDefined()
    expect(result.records_inserted).toBe(2)
  })

  it('aaawhen the transaction function is called with 2 records, it returns `records_inserted=2`', () => {
    const trCustomer = bulkInsert({ db, insert_query: QUERY.INSERT_CUSTOMER })
    const trProduct = bulkInsert({ db, insert_query: QUERY.INSERT_PRODUCT })
    const trInvoice = bulkInsert({ db, insert_query: QUERY.INSERT_INVOICE })

    const customers = [{ name: 'John Foo' }, { name: 'Jane Bar' }]
    const res_cus = trCustomer(customers)
    expect(res_cus.records_inserted).toBe(2)

    const products = [
      { name: 'sleek shoes' },
      { name: 'nice book' },
      { name: 'cool hat' }
    ]
    const res_prod = trProduct(products)
    expect(res_prod.records_inserted).toBe(3)

    const invoices = [
      {
        customer_id: 1,
        product_id: 1,
        gross_total: 1.23,
        payment_method: 'Stripe',
        issued_year: 2020
      },
      {
        customer_id: 1,
        product_id: 2,
        gross_total: 4.56,
        payment_method: 'Stripe',
        issued_year: 2021
      },
      {
        customer_id: 2,
        product_id: 1,
        gross_total: 1.23,
        payment_method: 'PayPal',
        issued_year: 2022
      },
      {
        customer_id: 2,
        product_id: 2,
        gross_total: 4.56,
        payment_method: 'PayPal',
        issued_year: 2022
      },
      {
        customer_id: 2,
        product_id: 3,
        gross_total: 7.89,
        payment_method: 'PayPal',
        issued_year: 2022
      }
    ]
    const res_invoice = trInvoice(invoices)
    expect(res_invoice.records_inserted).toBe(5)
  })
})
