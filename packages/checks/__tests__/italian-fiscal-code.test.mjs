import { isItalianFiscalCode } from '../lib/italian-fiscal-code.js'

describe('isItalianFiscalCode', () => {
  it('is false if the input string is empty', () => {
    expect(isItalianFiscalCode('')).toBe(false)
  })

  it('is false if the input string contains a space', () => {
    expect(isItalianFiscalCode('ABCDEFGHI JKLMNO')).toBe(false)
  })

  it('is true if the input string is a valid CF', () => {
    expect(isItalianFiscalCode('DBDGCM84D16G628W')).toBe(true)
  })

  it('is false if the input string is a valid CF but with extra spaces', () => {
    expect(isItalianFiscalCode(' DBDGCM84D16G628W ')).toBe(false)
    expect(isItalianFiscalCode(' DBDGCM84D16G628W')).toBe(false)
    expect(isItalianFiscalCode('DBDGCM84D16G628W ')).toBe(false)
    expect(isItalianFiscalCode(' DBDGCM84D16G628W '.trim())).toBe(true)
  })
})
