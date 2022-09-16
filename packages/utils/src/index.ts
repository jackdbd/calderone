/**
 * Miscellaneous utility functions.
 *
 * @packageDocumentation
 */
export { range, fisherYatesShuffle, partitions } from './array.js'
export type { PartitionsConfig } from './array.js'

export {
  addDays,
  dateFormatOptions,
  isoString,
  itDateString,
  itDateStringAfterNDays,
  LOCALE_STRING_OPTIONS,
  nowAndFutureUTC,
  nowAndPastTimestampMs,
  nowAndPastUTC,
  utcObjectFromDate
} from './dates.js'
export type { IsoStringConfig, UTCDateAsObject } from './dates.js'

export {
  entriesResolvedFromEnv,
  envVarNotFoundInEnv,
  gcloudArgs,
  regexFactory,
  requiredConfigValueNotSet,
  stringResolvedFromEnv
} from './deploy.js'
export type { Options as DeployOptions } from './deploy.js'

export {
  logAlert,
  logCritical,
  logDebug,
  logEmergency,
  logError,
  logInfo,
  logNotice,
  logWarning
} from './logger.js'
export type { Dictionary, LogData } from './logger.js'

export { monorepoRoot, renameJsFilesToMjs, walk } from './path.js'

export { spawnFunctionsFramework, killFunctionsFramework } from './test.js'
export type { Options as TestOptions } from './test.js'

export { makeWaitMs, wait1000Ms } from './wait.js'
