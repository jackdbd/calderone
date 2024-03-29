/**
 * Checks whether a string is a valid Austrian VAT number or not.
 *
 * @public
 */
export const isAustrianVat = (s: string) => {
  return s.match(/^(AT)?U[0-9]{8}$/) ? true : false
}

/**
 * Checks whether a string is a valid Belgian VAT number or not.
 *
 * @public
 */
export const isBelgianVat = (s: string) => {
  return s.match(/^(BE)?0[0-9]{9}$/) ? true : false
}

/**
 * Checks whether a string is a valid Bulgarian VAT number or not.
 * @public
 */
export const isBulgarianVat = (s: string) => {
  return s.match(/^(BG)?[0-9]{9,10}$/) ? true : false
}

/**
 * Checks whether a string is a valid Cypriotic VAT number or not.
 *
 * @public
 */
export const isCyprioticVat = (s: string) => {
  return s.match(/^(CY)?[0-9]{8}L$/) ? true : false
}

/**
 * Checks whether a string is a valid Czech VAT number or not.
 *
 * @public
 */
export const isCzechVat = (s: string) => {
  return s.match(/^(CZ)?[0-9]{8,10}$/) ? true : false
}

/**
 * Checks whether a string is a valid Danish VAT number or not.
 *
 * @public
 */
export const isDanishVat = (s: string) => {
  return s.match(/^(DK)?[0-9]{8}$/) ? true : false
}

/**
 * Checks whether a string is a valid Estonian VAT number or not.
 *
 * @public
 */
export const isEstonianVat = (s: string) => {
  return s.match(/^(EE)?[0-9]{9}$/) ? true : false
}

/**
 * Checks whether a string is a valid Finnish VAT number or not.
 *
 * @public
 */
export const isFinnishVat = (s: string) => {
  return s.match(/^(FI)?[0-9]{8}$/) ? true : false
}

/**
 * Checks whether a string is a valid French VAT number or not.
 *
 * @public
 */
export const isFrenchVat = (s: string) => {
  return s.match(/^(FR)?[0-9A-Z]{2}[0-9]{9}$/) ? true : false
}

/**
 * Checks whether a string is a valid German VAT number or not.
 *
 * @public
 */
export const isGermanVat = (s: string) => {
  return s.match(/^(DE)?[0-9]{9}$/) ? true : false
}

/**
 * Checks whether a string is a valid Greek VAT number or not.
 *
 * @public
 */
export const isGreekVat = (s: string) => {
  return s.match(/^(EL|GR)?[0-9]{9}$/) ? true : false
}

/**
 * Checks whether a string is a valid Hungarian VAT number or not.
 *
 * @public
 */
export const isHungarianVat = (s: string) => {
  return s.match(/^(HU)?[0-9]{8}$/) ? true : false
}

/**
 * Checks whether a string is a valid Irish VAT number or not.
 *
 * @public
 */
export const isIrishVat = (s: string) => {
  return s.match(/^(IE)?[0-9]S[0-9]{5}L$/) ? true : false
}

/**
 * Checks whether a string is a valid Italian VAT number or not.
 *
 * @public
 */
export const isItalianVat = (s: string) => {
  return s.match(/^(IT)?[0-9]{11}$/) ? true : false
}

/**
 * Checks whether a string is a valid Luxembourgish VAT number or not.
 *
 * @public
 */
export const isLuxembourgishVat = (s: string) => {
  return s.match(/^(LU)?[0-9]{8}$/) ? true : false
}

/**
 * Checks whether a string is a valid Spanish VAT number or not.
 *
 * @public
 */
export const isSpanishVat = (s: string) => {
  return s.match(/^(ES)?[0-9A-Z][0-9]{7}[0-9A-Z]$/) ? true : false
}

/**
 * Checks whether a string is a valid UK VAT number or not.
 *
 * @public
 *
 * @remarks after Brexit, a UK VAT number is no longer a Europer VAT number.
 * @see [UK VAT after the transitional period](https://www.icaew.com/brexit/uk-vat-after-the-transition-period)
 * @see [VAT on goods after Brexit](https://www.kvk.nl/english/brexit/vat-on-goods-after-brexit/)
 * @see [UK exited EU VAT regime 31 December 2020](https://www.avalara.com/vatlive/en/vat-news/uk-to-leave-eu-vat-regime-31-dec-20200.html)
 */
export const isUkVat = (s: string) => {
  return s.match(/^(GB)?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})$/) ? true : false
}

/**
 * Checks whether a string is a valid European VAT number or not.
 *
 * @public
 *
 * @see [VIES VAT number validation - European Commission](https://ec.europa.eu/taxation_customs/vies/)
 * @see [European VAT Numbers -O'Reilly](https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s21.html)
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
    isSpanishVat(s)

  return b
}
