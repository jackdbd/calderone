/**
 * A few functions useful when working with [better-sqlite3](https://github.com/WiseLibs/better-sqlite3).
 *
 * @packageDocumentation
 */

export { DEPRECATED_PRAGMAS, PRAGMAS } from './constants.js'

export { foreignKeys, pragmaDict, tableInfo } from './pragmas.js'
export type { ColumnInfo, ForeignKey } from './pragmas.js'

export { bulkInsert } from './transactions.js'
export type { BulkInsertConfig } from './transactions.js'
