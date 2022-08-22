import BetterSqlite3 from 'better-sqlite3'

export const sqliteDatabase = (options) => {
  return new BetterSqlite3(':memory:', options)
}

export const DDL = {
  CREATE_TABLE_CUSTOMER: `
  CREATE TABLE customer (
    id INTEGER PRIMARY KEY,

    name TEXT NOT NULL
  );`,

  CREATE_TABLE_PRODUCT: `
  CREATE TABLE product (
    id INTEGER PRIMARY KEY,

    name TEXT NOT NULL,
    image BLOB DEFAULT NULL
  );`,

  CREATE_TABLE_INVOICE: `
  CREATE TABLE invoice (
    id INTEGER PRIMARY KEY,

    customer_id INTEGER NOT NULL,

    product_id INTEGER NOT NULL,

    gross_total REAL NOT NULL,

    payment_method TEXT DEFAULT NULL,

    issued_year INTEGER NOT NULL DEFAULT 2022 CHECK(
      issued_year >= 2020
    ),

    FOREIGN KEY (customer_id) REFERENCES customer (id),
    FOREIGN KEY (product_id) REFERENCES product (id)
  );`
}

export const QUERY = {
  INSERT_CUSTOMER: `
  INSERT INTO customer 
  (
    name
  )
  VALUES 
  (
    $name
  );`,

  INSERT_PRODUCT: `
  INSERT INTO product 
  (
    name
  )
  VALUES 
  (
    $name
  );`,

  INSERT_INVOICE: `
  INSERT INTO invoice 
  (
    customer_id,
    product_id,
    gross_total,
    payment_method,
    issued_year
  )
  VALUES 
  (
    $customer_id,
    $product_id,
    $gross_total,
    $payment_method,
    $issued_year
  );`
}
