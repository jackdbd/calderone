import type BetterSqlite3 from 'better-sqlite3'
import makeDebug from 'debug'
import { PRAGMAS } from './constants.js'

const debug = makeDebug('sqlite-utils/pragmas')

/**
 * @public
 */
export interface ColumnInfo {
  cid: number
  name: string
  type: string // 'INTEGER', 'REAL' and other SQLite types I think
  notnull: 0 | 1 // 0 or 1 (boolean)
  dflt_value: any // null or what?
  pk: 0 | 1 // 0 or 1 (boolean)
}

/**
 * Returns an array where each item is a piece of information about a column of
 * the requested table.
 *
 * @public
 */
export const tableInfo = (db: BetterSqlite3.Database, table_name: string) => {
  // The PRAGMA statement below would not raise an exception, but since it
  // doesn't make sense to ask for info on a table that doesn't exist, I make
  // this check first.
  try {
    db.exec(`SELECT count(*) FROM '${table_name}' LIMIT 1`)
  } catch (err: any) {
    // const e = err as BetterSqlite3.SqliteError
    throw new Error(
      `Cannot retrieve info: SQLite database ${db.name} has no table ${table_name}`
    )
  }

  return db.pragma(`table_info(${table_name})`) as ColumnInfo[]
}

/**
 * @public
 */
export interface ForeignKey {
  id: number
  seq: number
  table: string
  from: string
  to: string
  on_update: string
  on_delete: string
  match: string
}

/**
 * Returns an array of all the foreign key constraints of the requested table.
 *
 * @public
 */
export const foreignKeys = (db: BetterSqlite3.Database, table_name: string) => {
  // The PRAGMA statement below would not raise an exception, but since it
  // doesn't make sense to ask for foreign keys on a table that doesn't exist,
  // I make this check first.
  try {
    db.exec(`SELECT count(*) FROM '${table_name}' LIMIT 1`)
  } catch (err: any) {
    // const e = err as BetterSqlite3.SqliteError
    throw new Error(
      `Cannot retrieve list of foreign key constraints: SQLite database ${db.name} has no table ${table_name}`
    )
  }

  const arr: ForeignKey[] = []
  const fk_list = db.pragma(`foreign_key_list(${table_name})`) as any[]
  for (const fk of fk_list) {
    arr.push(fk)
  }

  return arr
}

/**
 * Returns a dictionary of the available PRAGMA statements in this SQLite
 * database, where each key-value pair is a PRAGMA with its associated value.
 *
 * PRAGMA statements not available in the provided SQLite database will not show
 * up in the dictionary.
 *
 * @see [PRAGMA Statements - sqlite.org](https://www.sqlite.org/pragma.html)
 *
 * @public
 */
export const pragmaDict = (db: BetterSqlite3.Database) => {
  const d: { [pragma: string]: any } = {}
  for (const pragma of PRAGMAS) {
    const values = db.pragma(pragma) as any[]

    if (values.length === 0) {
      debug(`PRAGMA ${pragma} not available in this database`)
    } else if (values.length === 1) {
      switch (pragma) {
        case 'busy_timeout': {
          d[pragma] = values[0]['timeout']
          break
        }
        case 'analysis_limit':
        case 'application_id':
        case 'auto_vacuum':
        case 'automatic_index':
        case 'cache_size':
        case 'cache_spill':
        case 'cell_size_check':
        case 'checkpoint_fullfsync':
        case 'data_version':
        case 'defer_foreign_keys':
        case 'encoding':
        case 'foreign_keys':
        case 'freelist_count':
        case 'fullfsync':
        case 'hard_heap_limit':
        case 'ignore_check_constraints':
        case 'integrity_check':
        case 'journal_mode':
        case 'journal_size_limit':
        case 'legacy_alter_table':
        case 'locking_mode':
        case 'max_page_count':
        case 'page_count':
        case 'page_size':
        case 'query_only':
        case 'quick_check':
        case 'read_uncommitted':
        case 'recursive_triggers':
        case 'reverse_unordered_selects':
        case 'schema_version':
        case 'secure_delete':
        case 'soft_heap_limit':
        case 'synchronous':
        case 'temp_store':
        case 'threads':
        case 'trusted_schema':
        case 'user_version':
        case 'wal_autocheckpoint':
        case 'writable_schema': {
          d[pragma] = values[0][pragma]
          break
        }
        default: {
          d[pragma] = values[0]
        }
      }
    } else {
      switch (pragma) {
        case 'compile_options': {
          d[pragma] = values.map((val: any) => val[pragma])
          break
        }

        case 'collation_list':
        case 'module_list':
        case 'pragma_list': {
          d[pragma] = values.map((val: any) => val['name'])
          break
        }

        default: {
          d[pragma] = values
        }
      }
    }
  }

  return d
}
