import type BetterSqlite3 from 'better-sqlite3'
import makeDebug from 'debug'
import { PRAGMAS } from './constants.js'

const debug = makeDebug('sqlite-utils/pragmas')

export const logTableInfo = (
  db: BetterSqlite3.Database,
  table_name: string
) => {
  // https://www.sqlite.org/pragma.html#pragma_table_info
  const info = db.pragma(`table_info(${table_name})`)
  debug(`info on table ${table_name}: %O`, info)
}

export const logForeignKeys = (
  db: BetterSqlite3.Database,
  table_name: string
) => {
  // https://www.sqlite.org/pragma.html#pragma_foreign_key_list
  const fk_list = db.pragma(`foreign_key_list(${table_name})`)
  if (fk_list.length > 0) {
    debug(`foreign keys of table ${table_name}`)
    for (const fk of fk_list) {
      debug(`${fk}`)
    }
  }
}

export const logCompileOptions = (db: BetterSqlite3.Database) => {
  //www.sqlite.org/pragma.html#pragma_compile_options
  const compile_options = db.pragma('compile_options')
  if (compile_options.length > 0) {
    const names = compile_options.map((f: any) => f.compile_options)
    debug(`${compile_options.length} compile_options set in db ${db.name}`)
    debug('%O', names)
  }
}

export const logFunctions = (db: BetterSqlite3.Database) => {
  // https://www.sqlite.org/pragma.html#pragma_function_list
  const functions = db.pragma('function_list')
  if (functions.length > 0) {
    const names = functions.map((f: any) => f.name)
    debug(`${functions.length} functions available in db ${db.name}`)
    debug('%O', names)
  }
}

/**
 * TODO: try these pragma statements:
 * https://www.sqlite.org/pragma.html#pragma_pragma_list
 * https://www.sqlite.org/pragma.html#pragma_query_only
 * https://www.sqlite.org/pragma.html#pragma_quick_check
 * https://www.sqlite.org/pragma.html#pragma_stats
 * https://www.sqlite.org/pragma.html#pragma_optimize
 */
export const logPragmas = (db: BetterSqlite3.Database) => {
  debug(`pragma statements for db ${db.name}`)
  for (const pragma of PRAGMAS) {
    const pragmas = db.pragma(pragma)
    const value = pragmas[0][pragma]
    debug(`${pragma} ${value}`)
  }
}
