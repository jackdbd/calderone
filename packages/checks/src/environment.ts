/**
 * Check whether the code is running on Cloud Build or not.
 *
 * https://cloud.google.com/build/docs/configuring-builds/substitute-variable-values#using_default_substitutions
 */
export const isOnCloudBuild = (env: NodeJS.ProcessEnv) => {
  if (env.BUILD_ID && env.LOCATION && env.PROJECT_ID && env.PROJECT_NUMBER) {
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
 * Check whether a service is running on Cloud Functions or not.
 *
 * - https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
 * - https://cloud.google.com/docs/authentication/production#automatically
 */
export const isOnCloudFunctions = (env: NodeJS.ProcessEnv) => {
  if (env.FUNCTION_SIGNATURE_TYPE) {
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
    return true
  } else {
    return false
  }
}

/**
 * Checks whether the code is being executed as a Cloud Run **service** or not.
 *
 * https://cloud.google.com/anthos/run/docs/reference/container-contract#env-vars
 */
export const isCloudRunService = (env: NodeJS.ProcessEnv) => {
  if (env.K_SERVICE) {
    return true
  } else {
    return false
  }
}

/**
 * Checks whether the code is being executed as a Cloud Run **job** or not.
 *
 * https://stackoverflow.com/questions/72755708/how-to-retrieve-name-and-revision-of-a-cloud-run-service-from-the-service-itsel
 */
export const isCloudRunJob = (env: NodeJS.ProcessEnv) => {
  if (env.CLOUD_RUN_JOB) {
    // env.CLOUD_RUN_EXECUTION
    return true
  } else {
    return false
  }
}
