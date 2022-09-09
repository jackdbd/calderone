import {
  country_code,
  country_code_2_chars,
  country_code_3_chars
} from '../lib/country-code.js'

describe('country_code', () => {
  it('is valid for: `DE`, `ES`, `IT`, `GB', () => {
    const COUNTRIES = ['DE', 'ES', 'IT', 'GB']
    COUNTRIES.forEach((code) => {
      const { error, value } = country_code.validate(code)

      expect(error).not.toBeDefined()
      expect(value).toBe(code)
    })
  })

  it('is valid for `DEU`, `ESP`, `ITA`, `GBR`', () => {
    const COUNTRIES = ['DEU', 'ESP', 'ITA', 'GBR']
    COUNTRIES.forEach((code) => {
      const { error, value } = country_code.validate(code)

      expect(error).not.toBeDefined()
      expect(value).toBe(code)
    })
  })
})

describe('country_code_2_chars', () => {
  it('is valid for: `DE`, `ES`, `IT`, `GB', () => {
    const COUNTRIES = ['DE', 'ES', 'IT', 'GB']
    COUNTRIES.forEach((code) => {
      const { error, value } = country_code_2_chars.validate(code)

      expect(error).not.toBeDefined()
      expect(value).toBe(code)
    })
  })

  it('is NOT valid for `DEU`, `ESP`, `ITA`, `GBR`', () => {
    const COUNTRIES = ['DEU', 'ESP', 'ITA', 'GBR']
    COUNTRIES.forEach((code) => {
      const { error } = country_code_2_chars.validate(code)

      expect(error).toBeDefined()
    })
  })
})

describe('country_code_3_chars', () => {
  it('is NOT valid for: `DE`, `ES`, `IT`, `GB', () => {
    const COUNTRIES = ['DE', 'ES', 'IT', 'GB']
    COUNTRIES.forEach((code) => {
      const { error } = country_code_3_chars.validate(code)

      expect(error).toBeDefined()
    })
  })

  it('is valid for `DEU`, `ESP`, `ITA`, `GBR`', () => {
    const COUNTRIES = ['DEU', 'ESP', 'ITA', 'GBR']
    COUNTRIES.forEach((code) => {
      const { error, value } = country_code_3_chars.validate(code)

      expect(error).not.toBeDefined()
      expect(value).toBe(code)
    })
  })
})
