import {
  isGermanVat,
  isItalianVat,
  isEuropeanVat,
  isDanishVat
} from '../lib/vat.js'

describe('isGermanVat', () => {
  it('is false if the input string is empty', () => {
    expect(isGermanVat('')).toBeFalsy()
  })

  it('is true if the input string contains 9 characters', () => {
    expect(isGermanVat('123456789')).toBeTruthy()
  })

  it('is true if the input string contains 11 characters with "DE" at the beginning', () => {
    expect(isGermanVat('DE123456789')).toBeTruthy()
  })
})

describe('isItalianVat', () => {
  it('is false if the input string is empty', () => {
    expect(isItalianVat('')).toBeFalsy()
  })

  it('is true if the input string contains 11 characters', () => {
    expect(isItalianVat('12345678901')).toBeTruthy()
  })

  it('is true if the input string contains 13 characters with "IT" at the beginning', () => {
    expect(isItalianVat('IT12345678901')).toBeTruthy()
  })
})

describe('isDanishVat', () => {
  it('is true if the input string contains 8 characters', () => {
    expect(isDanishVat('37512737')).toBeTruthy()
  })
})

describe('isEuropeanVat', () => {
  it('is false if the input string is empty', () => {
    expect(isEuropeanVat('')).toBeFalsy()
  })
})
