import fs from 'node:fs'
import path from 'node:path'
import { env } from 'node:process'
import { isOnGithub } from '../../checks/lib/environment.js'
import { monorepoRoot } from '../../utils/lib/path.js'

export const oAuthTokens = () => {
  let json
  if (isOnGithub(env)) {
    json = env.KEAP_OAUTH_TOKENS
  } else {
    const json_path = path.join(
      monorepoRoot(),
      'secrets',
      'keap-oauth-tokens.json'
    )
    json = fs.readFileSync(json_path).toString()
  }

  const { access_token, refresh_token, scope, expires_in, token_type } =
    JSON.parse(json)

  return { access_token, refresh_token, scope, expires_in, token_type }
}

export const oAuthClientCredentials = () => {
  let json
  if (isOnGithub(env)) {
    json = env.KEAP_OAUTH_CLIENT_CREDENTIALS
  } else {
    const json_path = path.join(
      monorepoRoot(),
      'secrets',
      'keap-oauth-client-credentials.json'
    )
    json = fs.readFileSync(json_path).toString()
  }

  const { client_id, client_secret } = JSON.parse(json)

  return { client_id, client_secret }
}
