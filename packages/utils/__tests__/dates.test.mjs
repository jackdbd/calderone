import { itDateString } from '../lib/dates.js'

describe('itDateString', () => {
  it('throws when the passed UNIX timestamp is negative', () => {
    expect(() => {
      itDateString(-1)
    }).toThrowError('UNIX timestamp cannot be negative')
  })

  it('returns the expected string', () => {
    const s = itDateString(0)

    expect(s).toBe('01/01/1970')
  })
})
