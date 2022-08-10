import { PRAGMAS, DEPRECATED_PRAGMAS } from '../lib/constants.js'

describe('PRAGMAS', () => {
  it('does not contain any deprecated SQLite PRAGMA statement', () => {
    DEPRECATED_PRAGMAS.forEach((deprecated_pragma) => {
      expect(PRAGMAS).not.toContain(deprecated_pragma)
    })
  })

  it('contains 67 SQLite PRAGMA statements', () => {
    expect(PRAGMAS.length).toBe(67)
  })
})

describe('DEPRECATED_PRAGMAS', () => {
  it('contains 7 SQLite PRAGMA statements', () => {
    expect(DEPRECATED_PRAGMAS.length).toBe(7)
  })
})
