import fs from 'node:fs'
import path from 'node:path'
import { isOnCloudBuild, isOnGithub } from '../../checks/lib/environment.js'
import { monorepoRoot } from '../../utils/lib/path.js'
import { makeEleventyFetch } from '../lib/fetch-clients/eleventy-fetch.js'

export const TEST_CACHE_DIRECTORY = '.cache-tests'
export const TEST_CACHE_DURATION = '3s'
export const TEST_FETCH_OPTIONS_USER_AGENT = 'plausible-test-client'
const TEST_VERBOSE = false

export const validApiCredentials = async (env) => {
  let json
  if (isOnGithub(env)) {
    // the GitHub workflow called 'CI' exposes a GitHub secret as an environment
    // variable called PLAUSIBLE
    json = env.PLAUSIBLE
  } else if (isOnCloudBuild(env)) {
    // Cloud Build (see cloudbuild.yaml) retrieves a secret from Secret Manager
    // and exposes it as an environment variable called PLAUSIBLE
    json = env.PLAUSIBLE
  } else {
    // this JSON file is on my computer and NOT tracked in git
    const json_path = path.join(monorepoRoot(), 'secrets', 'plausible.json')
    json = fs.readFileSync(json_path).toString()
  }

  const secret = JSON.parse(json)
  const { api_key: apiKey, site_id: siteId } = secret

  return { apiKey, siteId }
}

export const makeFetchTestClient = async (apiKey) => {
  return makeEleventyFetch(apiKey, {
    directory: TEST_CACHE_DIRECTORY,
    duration: TEST_CACHE_DURATION,
    fetchOptions: { 'user-agent': TEST_FETCH_OPTIONS_USER_AGENT },
    verbose: TEST_VERBOSE
  })
}
