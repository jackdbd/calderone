export const REGEX_ITALIAN_FISCAL_CODE =
  /^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$/

/**
 * Check whether a string is a valid Italian Fiscal Code (Codice Fiscale).
 *
 * - http://www.codicefiscaleonline.com/codice_inverso.php
 * - http://blog.marketto.it/2016/01/regex-validazione-codice-fiscale-con-omocodia/
 * - https://blog.massimopetrossi.com/sicurezza-informatica/una-regex-per-validare-il-codice-fiscale/
 */
export const isItalianFiscalCode = (s: string) => {
  return s.match(REGEX_ITALIAN_FISCAL_CODE) ? true : false
}
