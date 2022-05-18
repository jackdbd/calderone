import makeDebug from 'debug'

const debug = makeDebug('checks/environment')

/**
 * Check whether the code is running on Cloud Build or not.
 *
 * https://cloud.google.com/build/docs/configuring-builds/substitute-variable-values#using_default_substitutions
 */
export const isOnCloudBuild = (env: NodeJS.ProcessEnv) => {
  if (env.PROJECT_ID && env.BUILD_ID && env.PROJECT_NUMBER && env.LOCATION) {
    debug('running on Cloud Build')
    return true
  } else {
    return false
  }
}

/**
 * Check whether the code is running on the GitHub CI or not.
 *
 * https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
 */
export const isOnGithub = (env: NodeJS.ProcessEnv) => {
  if (env.GITHUB_SHA) {
    debug('running on GitHub')
    return true
  } else {
    return false
  }
}

export const isDevelopment = (env: NodeJS.ProcessEnv) => {
  if (env.NODE_ENV === 'development') {
    return true
  } else {
    return false
  }
}

export const isProduction = (env: NodeJS.ProcessEnv) => {
  if (env.NODE_ENV === 'production') {
    return true
  } else {
    return false
  }
}

export const isTest = (env: NodeJS.ProcessEnv) => {
  if (env.NODE_ENV === 'test') {
    return true
  } else {
    return false
  }
}

/**
 * SA_JSON_KEY is an environment variable that I use when running a
 * containerized application on my laptop. It's JSON-stringified service account
 * credentials.
 */
export const isOnLocalContainer = (env: NodeJS.ProcessEnv) => {
  if (env.SA_JSON_KEY) {
    return true
  } else {
    return false
  }
}

/**
 * Check whether a service is running on Cloud Functions or not.
 *
 * - https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
 * - https://cloud.google.com/docs/authentication/production#automatically
 */
export const isOnCloudFunctions = (env: NodeJS.ProcessEnv) => {
  if (env.FUNCTION_SIGNATURE_TYPE) {
    debug('running on Cloud Functions')
    return true
  } else {
    return false
  }
}

/**
 * Check whether a service is running on Cloud Run or not.
 *
 * - https://cloud.google.com/anthos/run/docs/reference/container-contract#env-vars
 */
export const isOnCloudRun = (env: NodeJS.ProcessEnv) => {
  if (env.K_SERVICE) {
    debug('running on Cloud Run')
    return true
  } else {
    return false
  }
}
