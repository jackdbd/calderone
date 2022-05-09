import { existsSync, readFileSync, unlinkSync } from 'node:fs'
import makeDebug from 'debug'
import BetterSqlite3 from 'better-sqlite3'
import { SQLITE_OPTIONS } from './constants.js'
import { logPragmas } from './pragmas.js'

const debug = makeDebug('sqlite-utils/db')

interface DbConfig {
  db_fullpath: string
  migration_script_fullpath: string
}

export const newDatabase = ({
  db_fullpath,
  migration_script_fullpath
}: DbConfig): BetterSqlite3.Database => {
  if (existsSync(db_fullpath)) {
    debug(`deleted existing db ${db_fullpath}`)
    unlinkSync(db_fullpath)
  }

  // const db = new makeDatabase(':memory:', SQLITE_OPTIONS)
  const db = new BetterSqlite3(db_fullpath, SQLITE_OPTIONS)
  debug(`created db ${db.name} with options %o`, SQLITE_OPTIONS)

  const migration = readFileSync(migration_script_fullpath, 'utf8').toString()

  debug(
    `migrate db ${db.name} with migration script ${migration_script_fullpath}`
  )
  db.exec(migration)

  // https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/performance.md
  // https://www.sqlite.org/pragma.html

  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  logPragmas(db)

  return db
}

interface InMemoryDbConfig {
  migration_script_fullpath?: string
}

export const newInMemoryDatabase = (
  config: InMemoryDbConfig
): BetterSqlite3.Database => {
  const { migration_script_fullpath } = config

  const db = new BetterSqlite3(':memory:', SQLITE_OPTIONS)

  if (migration_script_fullpath) {
    const migration = readFileSync(migration_script_fullpath, 'utf8').toString()
    debug(
      `migrate db ${db.name} with migration script ${migration_script_fullpath}`
    )
    db.exec(migration)
  } else {
    debug(`no migrations to run for db ${db.name}`)
  }

  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  return db
}
