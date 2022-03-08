interface Dictionary {
  [key: string]:
    | string
    | number
    | boolean
    | symbol
    | undefined
    | null
    | Dictionary;
}
interface LogData {
  message: string;
  [key: string]:
    | string
    | number
    | boolean
    | symbol
    | undefined
    | null
    | Dictionary;
}

// Structured logs
// https://cloud.google.com/functions/docs/monitoring/logging#writing_structured_logs
function isStructuredLog(data: LogData | string): data is LogData {
  return (data as LogData).message !== undefined;
}

// LogSeverity
// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry?authuser=1#logseverity

const DEBUG = {
  severity: "DEBUG",
};

const INFO = {
  severity: "INFO",
};

const NOTICE = {
  severity: "NOTICE",
};

const WARNING = {
  severity: "WARNING",
};

const ERROR = {
  severity: "ERROR",
};
const CRITICAL = {
  severity: "CRITICAL",
};

const ALERT = {
  severity: "ALERT",
};
const EMERGENCY = {
  severity: "EMERGENCY",
};

export const logDebug = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, DEBUG, data)));
  } else {
    console.debug(data);
  }
};

export const logInfo = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, INFO, data)));
  } else {
    console.info(data);
  }
};

export const logNotice = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, NOTICE, data)));
  } else {
    console.info(data);
  }
};

export const logWarning = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, WARNING, data)));
  } else {
    console.warn(data);
  }
};

export const logError = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, ERROR, data)));
  } else {
    console.error(data);
  }
};

export const logCritical = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, CRITICAL, data)));
  } else {
    console.error(data);
  }
};

export const logAlert = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, ALERT, data)));
  } else {
    console.error(data);
  }
};

export const logEmergency = (data: LogData | string) => {
  if (isStructuredLog(data)) {
    console.log(JSON.stringify(Object.assign({}, EMERGENCY, data)));
  } else {
    console.error(data);
  }
};
