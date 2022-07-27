/**
 * This package contains various functions to check inputs (i.e. predicates).
 *
 * @packageDocumentation
 */

export {
  isCloudRunJob,
  isCloudRunService,
  isDevelopment,
  isOnCloudRun,
  isOnCloudFunctions,
  isOnGithub,
  isTest
} from './environment.js'

export { isItalianFiscalCode } from './italian-fiscal-code.js'

export { isError, isString, isTimeout } from './type-guards.js'

export {
  isAustrianVat,
  isBelgianVat,
  isBulgarianVat,
  isCyprioticVat,
  isCzechVat,
  isDanishVat,
  isEstonianVat,
  isEuropeanVat,
  isFinnishVat,
  isFrenchVat,
  isGermanVat,
  isGreekVat,
  isHungarianVat,
  isIrishVat,
  isItalianVat,
  isLuxembourgishVat,
  isSpanishVat,
  isUkVat
} from './vat.js'
