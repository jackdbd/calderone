import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { monorepoRoot } from '@jackdbd/utils/path'

export const googleApplicationCredentials = (filename: string) => {
  return path.join(monorepoRoot(), 'secrets', filename)
}

export const localJSONSecret = async <T = any>(filename: string) => {
  const filepath = path.join(monorepoRoot(), 'secrets', filename)

  const json_string = await readFile(filepath, { encoding: 'utf8' })

  return JSON.parse(json_string) as T
}
