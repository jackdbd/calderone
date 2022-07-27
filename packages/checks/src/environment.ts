/**
 * Checks whether the code is being executed on Cloud Build or not.
 *
 * @public
 *
 * @see [Substituting variable values - Cloud Build](https://cloud.google.com/build/docs/configuring-builds/substitute-variable-values)
 */
export const isOnCloudBuild = (env: NodeJS.ProcessEnv) => {
  if (env.BUILD_ID && env.LOCATION && env.PROJECT_ID && env.PROJECT_NUMBER) {
    return true
  } else {
    return false
  }
}

/**
 * Checks whether the code is running on the GitHub CI or not.
 *
 * @public
 *
 * @see [Default environment variables - GitHub Docs](https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables)
 */
export const isOnGithub = (env: NodeJS.ProcessEnv) => {
  if (env.GITHUB_SHA) {
    return true
  } else {
    return false
  }
}

/**
 * Checks whether the environment variable `NODE_ENV` is set to `development` or not.
 *
 * @public
 */
export const isDevelopment = (env: NodeJS.ProcessEnv) => {
  if (env.NODE_ENV === 'development') {
    return true
  } else {
    return false
  }
}

/**
 * Checks whether the environment variable `NODE_ENV` is set to `production` or not.
 *
 * @public
 */
export const isProduction = (env: NodeJS.ProcessEnv) => {
  if (env.NODE_ENV === 'production') {
    return true
  } else {
    return false
  }
}

/**
 * Checks whether the environment variable `NODE_ENV` is set to `test` or not.
 *
 * @public
 */
export const isTest = (env: NodeJS.ProcessEnv) => {
  if (env.NODE_ENV === 'test') {
    return true
  } else {
    return false
  }
}

/**
 * Checks whether a service is running on Cloud Functions or not.
 *
 * @public
 *
 * @see [Using Environment Variables - Cloud Functions](https://cloud.google.com/functions/docs/configuring/env-var)
 */
export const isOnCloudFunctions = (env: NodeJS.ProcessEnv) => {
  if (env.FUNCTION_SIGNATURE_TYPE) {
    return true
  } else {
    return false
  }
}

/**
 * Checks whether a service is running on Cloud Run or not.
 *
 * @public
 * @deprecated Use {@link @jackdbd/checks#isCloudRunJob} or {@link @jackdbd/checks#isCloudRunService} instead.
 *
 * @see [Container runtime contract - Anthos](https://cloud.google.com/anthos/run/docs/reference/container-contract)
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
 * @public
 *
 * @see [Container runtime contract - Anthos](https://cloud.google.com/anthos/run/docs/reference/container-contract)
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
 * @public
 *
 * @see [How to retrieve name and revision of a Cloud Run service, from the service itself?](https://stackoverflow.com/questions/72755708/how-to-retrieve-name-and-revision-of-a-cloud-run-service-from-the-service-itsel)
 */
export const isCloudRunJob = (env: NodeJS.ProcessEnv) => {
  if (env.CLOUD_RUN_JOB) {
    return true
  } else {
    return false
  }
}
