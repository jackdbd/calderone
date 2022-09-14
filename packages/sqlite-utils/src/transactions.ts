import type BetterSqlite3 from 'better-sqlite3'
import makeDebug from 'debug'

const debug = makeDebug('sqlite-utils/transactions')

/**
 * @public
 */
export interface BulkInsertConfig {
  db: BetterSqlite3.Database
  insert_query: string
}

/**
 * Creates a SQLite transaction that will run a SQL statement on each record and
 * either commit the results, or rollback to the original state of the database.
 *
 * @see [transaction function - better-sqlite3 API docs](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#transactionfunction---function)
 * @see [Transaction - SQLite.org](https://www.sqlite.org/lang_transaction.html)
 *
 * @public
 */
export const bulkInsert = <BindParams extends any[]>({
  db,
  insert_query
}: BulkInsertConfig) => {
  const stmt = db.prepare<BindParams>(insert_query)

  const fn = (records: BindParams[]) => {
    let n = 0
    for (const bind_params of records) {
      debug(`bind parameters to insert query %O`, bind_params)
      stmt.run(bind_params)
      n++
    }

    return {
      message: `committed transaction: bulk insert of ${n} records in database ${db.name}`,
      records_inserted: n
    }
  }

  return db.transaction(fn) as BetterSqlite3.Transaction
}
