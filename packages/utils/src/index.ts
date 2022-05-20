/**
 * Miscellaneous utility functions.
 *
 * @packageDocumentation
 */
export { range, fisherYatesShuffle } from './array.js'

export {
  addDays,
  dateFormatOptions,
  itDateString,
  itDateStringAfterNDays,
  LOCALE_STRING_OPTIONS,
  nowAndFutureUTC,
  nowAndPastTimestampMs,
  nowAndPastUTC
} from './dates.js'

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
