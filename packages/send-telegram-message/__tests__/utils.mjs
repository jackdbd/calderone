import fs from 'node:fs'
import path from 'node:path'
import { isOnGithub } from '@jackdbd/checks/environment'

export const jsonStringSecret = ({
  environment_variable_name,
  secret_filename
}) => {
  let str
  if (isOnGithub(process.env)) {
    str = process.env[environment_variable_name]
  } else {
    const filepath = path.resolve('..', '..', 'secrets', secret_filename)
    str = fs.readFileSync(filepath, 'utf8')
  }
  return str
}

export const jsonParsedSecret = ({
  environment_variable_name,
  secret_filename
}) => {
  return JSON.parse(
    jsonStringSecret({
      environment_variable_name,
      secret_filename
    })
  )
}
