import makeDebug from 'debug'

const debug = makeDebug('checks/vat')

export const isAustrianVat = (s: string) => {
  const b = s.match(/^(AT)?U[0-9]{8}$/) ? true : false
  debug('is Austrian VAT? %s %s', s, b)
  return b
}

export const isBelgianVat = (s: string) => {
  const b = s.match(/^(BE)?0[0-9]{9}$/) ? true : false
  debug('is Belgian VAT? %s %s', s, b)
  return b
}

export const isBulgarianVat = (s: string) => {
  const b = s.match(/^(BG)?[0-9]{9,10}$/) ? true : false
  debug('is Bulgarian VAT? %s %s', s, b)
  return b
}

export const isCyprioticVat = (s: string) => {
  const b = s.match(/^(CY)?[0-9]{8}L$/) ? true : false
  debug('is Cypriotic VAT? %s %s', s, b)
  return b
}

export const isCzechVat = (s: string) => {
  const b = s.match(/^(CZ)?[0-9]{8,10}$/) ? true : false
  debug('is Czech VAT? %s %s', s, b)
  return b
}

export const isDanishVat = (s: string) => {
  const b = s.match(/^(DK)?[0-9]{8}$/) ? true : false
  debug('is Danish VAT? %s %s', s, b)
  return b
}

export const isEstonianVat = (s: string) => {
  const b = s.match(/^(EE)?[0-9]{9}$/) ? true : false
  debug('is Estonian VAT? %s %s', s, b)
  return b
}

export const isFinnishVat = (s: string) => {
  const b = s.match(/^(FI)?[0-9]{8}$/) ? true : false
  debug('is Finnish VAT? %s %s', s, b)
  return b
}

export const isFrenchVat = (s: string) => {
  const b = s.match(/^(FR)?[0-9A-Z]{2}[0-9]{9}$/) ? true : false
  debug('is French VAT? %s %s', s, b)
  return b
}

export const isGermanVat = (s: string) => {
  const b = s.match(/^(DE)?[0-9]{9}$/) ? true : false
  debug('is German VAT? %s %s', s, b)
  return b
}

export const isGreekVat = (s: string) => {
  const b = s.match(/^(EL|GR)?[0-9]{9}$/) ? true : false
  debug('is Greek VAT? %s %s', s, b)
  return b
}

export const isHungarianVat = (s: string) => {
  const b = s.match(/^(HU)?[0-9]{8}$/) ? true : false
  debug('is Hungarian VAT? %s %s', s, b)
  return b
}

export const isIrishVat = (s: string) => {
  const b = s.match(/^(IE)?[0-9]S[0-9]{5}L$/) ? true : false
  debug('is Irish VAT? %s %s', s, b)
  return b
}

export const isItalianVat = (s: string) => {
  const b = s.match(/^(IT)?[0-9]{11}$/) ? true : false
  debug('is Italian VAT? %s %s', s, b)
  return b
}

export const isLuxembourgishVat = (s: string) => {
  const b = s.match(/^(LU)?[0-9]{8}$/) ? true : false
  debug('is Luxembourgish VAT? %s %s', s, b)
  return b
}

export const isSpanishVat = (s: string) => {
  const b = s.match(/^(ES)?[0-9A-Z][0-9]{7}[0-9A-Z]$/) ? true : false
  debug('is Spanish VAT? %s %s', s, b)
  return b
}

export const isUkVat = (s: string) => {
  const b = s.match(/^(GB)?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})$/)
    ? true
    : false
  debug('is UK VAT? %s %s', s, b)
  return b
}

/**
 * Check whether a string is a valid European VAT number.
 *
 * - https://ec.europa.eu/taxation_customs/vies/
 * - https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s21.html
 */
export const isEuropeanVat = (s: string) => {
  const b =
    isAustrianVat(s) ||
    isBelgianVat(s) ||
    isBulgarianVat(s) ||
    isCyprioticVat(s) ||
    isCzechVat(s) ||
    isDanishVat(s) ||
    isEstonianVat(s) ||
    isFinnishVat(s) ||
    isFrenchVat(s) ||
    isGermanVat(s) ||
    isGreekVat(s) ||
    isHungarianVat(s) ||
    isIrishVat(s) ||
    isItalianVat(s) ||
    isLuxembourgishVat(s) ||
    isSpanishVat(s) ||
    isUkVat(s)

  debug(`is ${s} a European VAT number? ${b}`)
  return b
}
