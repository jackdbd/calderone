import { foreignKeys, pragmaDict, tableInfo } from '../lib/pragmas.js'
import { sqliteDatabase, DDL } from './utils.mjs'

describe('foreignKeys', () => {
  let db

  beforeAll(() => {
    db = sqliteDatabase()
    db.exec(DDL.CREATE_TABLE_CUSTOMER)
    db.exec(DDL.CREATE_TABLE_PRODUCT)

    // this is not required, but it's better to be explicit in tests
    db.pragma('foreign_keys = ON')

    db.exec(DDL.CREATE_TABLE_INVOICE)
  })

  it('throws when the table does not exist in the database', () => {
    expect(() => {
      foreignKeys(db, 'foo')
    }).toThrow('no table foo')
  })

  it('is an array of no elements when the table exists and has no foreign keys', () => {
    const arr = foreignKeys(db, 'customer')

    expect(arr).toBeDefined()
    expect(arr.length).toBe(0)
  })

  it(`is an array of 2 elements for the table 'invoice' (which exists and has 2 foreign keys)`, () => {
    const arr = foreignKeys(db, 'invoice')

    expect(arr).toBeDefined()
    expect(arr.length).toBe(2)
    const tables = arr.map((d) => d.table)
    // console.log('arr', arr)
    expect(tables).toContain('product')
    expect(tables).toContain('customer')
    expect(arr[0].from).toBe('product_id')
    expect(arr[1].from).toBe('customer_id')
  })
})

describe('pragmaDict', () => {
  let db

  beforeAll(() => {
    db = sqliteDatabase()
  })

  it('has 3 items in collation_list', () => {
    const d = pragmaDict(db)

    expect(d).toBeDefined()

    expect(d.collation_list).toBeDefined()
    expect(d.collation_list.length).toBe(3)
  })

  it('has ENABLE_GEOPOLY, ENABLE_MATH_FUNCTIONS, and ENABLE_RTREE in compile_options', () => {
    const d = pragmaDict(db)

    expect(d).toBeDefined()

    expect(d.compile_options).toBeDefined()
    expect(d.compile_options.length).toBeGreaterThan(0)
    expect(d.compile_options).toContain('ENABLE_GEOPOLY')
    expect(d.compile_options).toContain('ENABLE_MATH_FUNCTIONS')
    expect(d.compile_options).toContain('ENABLE_RTREE')
  })

  it('has more than 150 entries in function_list', () => {
    const d = pragmaDict(db)

    expect(d).toBeDefined()

    expect(d.function_list).toBeDefined()
    expect(d.function_list.length).toBeGreaterThan(150)
  })
})

describe('tableInfo', () => {
  let db

  beforeAll(() => {
    db = sqliteDatabase()
    db.exec(DDL.CREATE_TABLE_CUSTOMER)
    db.exec(DDL.CREATE_TABLE_PRODUCT)

    // this is not required, but it's better to be explicit in tests
    db.pragma('foreign_keys = ON')

    db.exec(DDL.CREATE_TABLE_INVOICE)
  })

  it('throws when the table does not exist in the database', () => {
    expect(() => {
      tableInfo(db, 'foo')
    }).toThrow('no table foo')
  })

  it('is an array of 2 element when the table exists and has 2 columns', () => {
    const info = tableInfo(db, 'customer')

    expect(info).toBeDefined()
    expect(info.length).toBe(2)
  })

  it('is an array of 6 elements when the table exists and has 6 columns', () => {
    const info = tableInfo(db, 'invoice')

    expect(info).toBeDefined()
    expect(info.length).toBe(6)
  })
})
