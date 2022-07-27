export interface Dictionary {
  [key: string]:
    | string
    | string[]
    | number
    | number[]
    | boolean
    | boolean[]
    | symbol
    | undefined
    | null
    | Dictionary
}
export interface LogData {
  message: string
  [key: string]:
    | string
    | string[]
    | number
    | number[]
    | boolean
    | boolean[]
    | symbol
    | undefined
    | null
    | Dictionary
}

// Structured logs
// https://cloud.google.com/functions/docs/monitoring/logging#writing_structured_logs
function isStructuredLog(data: LogData | string): data is LogData {
  return (data as LogData).message !== undefined
}

// LogSeverity
// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry?authuser=1#logseverity

const DEBUG = {
  severity: 'DEBUG'
}

const INFO = {
  severity: 'INFO'
}

const NOTICE = {
  severity: 'NOTICE'
}

const WARNING = {
  severity: 'WARNING'
}

const ERROR = {
  severity: 'ERROR'
}
const CRITICAL = {
  severity: 'CRITICAL'
}

const ALERT = {
  severity: 'ALERT'
}
const EMERGENCY = {
  severity: 'EMERGENCY'
}

/**
 * @public
 */
export const logDebug = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, DEBUG, data)))
  } else {
    console.debug(data)
  }
}

/**
 * @public
 */
export const logInfo = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, INFO, data)))
  } else {
    console.info(data)
  }
}

/**
 * @public
 */
export const logNotice = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, NOTICE, data)))
  } else {
    console.info(data)
  }
}

/**
 * @public
 */
export const logWarning = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, WARNING, data)))
  } else {
    console.warn(data)
  }
}

/**
 * @public
 */
export const logError = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, ERROR, data)))
  } else {
    console.error(data)
  }
}

/**
 * @public
 */
export const logCritical = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, CRITICAL, data)))
  } else {
    console.error(data)
  }
}

/**
 * @public
 */
export const logAlert = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, ALERT, data)))
  } else {
    console.error(data)
  }
}

/**
 * @public
 */
export const logEmergency = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, EMERGENCY, data)))
  } else {
    console.error(data)
  }
}
