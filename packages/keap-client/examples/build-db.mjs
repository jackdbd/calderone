import fs from 'fs'
import path from 'path'
import BetterSqlite3 from 'better-sqlite3'
import { monorepoRoot } from '../lib/utils.js'
import { fsStore } from '../lib/tokens-stores/fs.js'
import { basicContactsClient } from '../lib/contacts/index.js'

const customFields = (custom_fields) => {
  const m = {
    codice_fiscale: undefined,
    fatturato_netto: undefined,
    id_stripe: undefined,
    partita_iva: undefined,
    ragione_sociale: undefined
  }

  for (const field of custom_fields) {
    // this number->key mapping is user-specific
    switch (field.id) {
      case 43:
        m.codice_fiscale = field.content || undefined
        break
      case 45:
        m.partita_iva = field.content || undefined
        break
      case 49:
        m.ragione_sociale = field.content || undefined
        break
      case 55:
        m.fatturato_netto = field.content || undefined
        break
      case 61:
        m.id_stripe = field.content || undefined
        break
      default:
        break
    }
  }

  return m
}

const DB_MIGRATION = `
CREATE TABLE customer
(
    codice_fiscale TEXT DEFAULT NULL CHECK(
        length(codice_fiscale) == 16
    ),

    email TEXT DEFAULT NULL,

    fatturato_netto REAL CHECK(
        fatturato_netto >= 0
    ),

    id_keap INTEGER DEFAULT NULL CHECK(
        id_keap > 0
    ),

    id_stripe TEXT DEFAULT NULL,

    partita_iva TEXT DEFAULT NULL CHECK(
        length(partita_iva) != 16
    ),

    phone TEXT DEFAULT NULL,

    ragione_sociale TEXT NOT NULL
);`

const INSERT_CUSTOMER = `
INSERT INTO customer 
(
    codice_fiscale,
    email,
    fatturato_netto,
    id_keap,
    id_stripe,
    partita_iva,
    phone,
    ragione_sociale
) 
VALUES 
(
    $codice_fiscale,
    $email,
    $fatturato_netto,
    $id_keap,
    $id_stripe,
    $partita_iva,
    $phone,
    $ragione_sociale
);`

const toSummary = ({
  custom_fields,
  email_addresses,
  family_name,
  given_name,
  id,
  phone_numbers,
  website
}) => {
  let name = given_name || ''
  if (family_name) {
    name = `${name} ${family_name}`
  }
  const extra_fields = customFields(custom_fields)
  const ragione_sociale = extra_fields.ragione_sociale || name

  let codice_fiscale = undefined
  if (extra_fields.codice_fiscale && extra_fields.codice_fiscale.length == 16) {
    codice_fiscale = extra_fields.codice_fiscale.toUpperCase()
  }

  return {
    codice_fiscale,
    email: email_addresses.map((d) => d.email).join(','),
    fatturato_netto: extra_fields.fatturato_netto,
    id_keap: id,
    id_stripe: extra_fields.id_stripe,
    name: given_name,
    partita_iva: extra_fields.partita_iva,
    phone: phone_numbers.map((d) => d.number).join(','),
    ragione_sociale,
    website
  }
}

const makePreparedStatements = (db) => {
  //   console.log(`prepare SQL statements for DB [${db.name}]`)
  return {
    insert_customer: db.prepare(INSERT_CUSTOMER)
  }
}

const makeTransactions = (db, statement_map) => {
  //   console.log(`prepare transactions for DB [${db.name}]`)
  return {
    insertManyCustomers: db.transaction((customers) => {
      console.log(`INSERT ${customers.length} customers in a transaction`)
      for (const params of customers) {
        statement_map.insert_customer.run(params)
      }
    })
  }
}

const main = async () => {
  const filepath = path.join(monorepoRoot(), 'secrets', 'keap.json')
  const store = fsStore(filepath)

  const { access_token } = await store.retrieve()

  const contacts_client = basicContactsClient({ access_token })

  const db_fullpath = path.join(monorepoRoot(), 'keap-contacts.db')
  if (fs.existsSync(db_fullpath)) {
    fs.unlinkSync(db_fullpath)
    console.log(`found and removed DB at ${db_fullpath}`)
  }

  const db = new BetterSqlite3(db_fullpath, { readonly: false })

  db.exec(DB_MIGRATION)
  console.log(`DB [${db.name}] migrated`)

  // https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/performance.md
  db.pragma('journal_mode = WAL')

  const m = makePreparedStatements(db)
  const { insertManyCustomers } = makeTransactions(db, m)

  const options = {
    optional_properties: 'custom_fields,website',
    pagination: {
      limit: 250,
      offset: 0,
      since: '2022-01-01T00:00:00.000Z',
      until: '2022-02-05T00:00:00.000Z'
    }
  }

  // we need to await because the generator retrieves the access token from the
  // store (e.g. filesystem store) during its configuration
  const asyncGen = await contacts_client.retrieveAsyncGenerator(options)

  let count = 0
  for await (let paginated of asyncGen) {
    count += paginated.data.length
    console.log(
      `${count}/${
        paginated.count - options.pagination.offset
      } contacts retrieved`
    )

    const customers = paginated.data.map(toSummary)
    insertManyCustomers(customers)
  }
}

main()
