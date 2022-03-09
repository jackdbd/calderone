import fs from 'node:fs'
import path from 'node:path'
import { env } from 'node:process'
import { isOnGithub } from '../../checks/lib/environment.js'
import { monorepoRoot } from '../../utils/lib/path.js'

export const credentials = () => {
  let json
  if (isOnGithub(env)) {
    json = env.FATTUREINCLOUD
  } else {
    const json_path = path.join(
      monorepoRoot(),
      'secrets',
      'fattureincloud.json'
    )
    json = fs.readFileSync(json_path).toString()
  }

  const { api_key, api_uid } = JSON.parse(json)
  return { api_key, api_uid }
}
