import type Joi from 'joi'
import type { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { accessSecretVersion } from '@jackdbd/secret-manager-utils/access-secret-version'

export const throwIfNotOnNodeJs = () => {
  if (!process) {
    throw new Error(
      `global variable 'process' not available. This code doesn't seem to run in Node.js`
    )
  }

  if (!process.env) {
    throw new Error(
      `gloabl variable 'process.env' not available. This code doesn't seem to run in Node.js`
    )
  }
}

export interface ValueFromEnvVarOrSecretConfig {
  description: string
  environment_variable: string
  gcp_project_id: string
  schema?: Joi.Schema
  secret_manager: SecretManagerServiceClient
  secret_name: string
  secret_version: string
}

// TODO: implement schema validation for strings, not just JSON objects

export const stringFromEnvVarOrSecret = async ({
  description,
  environment_variable,
  gcp_project_id,
  secret_manager,
  secret_name,
  secret_version
}: ValueFromEnvVarOrSecretConfig) => {
  let retrieved_from = ''
  let value = ''

  if (process.env[environment_variable]) {
    value = process.env[environment_variable] as string
    retrieved_from = `environment variable ${environment_variable}`
  } else {
    value = await accessSecretVersion({
      project_id: gcp_project_id,
      secret_manager: secret_manager as any,
      secret_name,
      version: secret_version
    })
    retrieved_from = `Secret Manager (secret name ${secret_name}, secret version ${secret_version})`
  }

  return { value, message: `${description} retrieved from ${retrieved_from}` }
}

export const jsonFromEnvVarOrSecret = async (
  config: ValueFromEnvVarOrSecretConfig
) => {
  const { value: str, message } = await stringFromEnvVarOrSecret(config)

  if (config.schema) {
    const { error, value } = config.schema.validate(JSON.parse(str), {
      allowUnknown: true
    })
    if (error) {
      const details = [
        `invalid value for ${config.description}`,
        error.message,
        message
      ]
      throw new Error(`${details.join('; ')}`)
    }
    return { value, message }
  } else {
    const value = JSON.parse(str)
    return { value, message }
  }
}

export interface ValueFromSecretConfig {
  gcp_project_id: string
  schema?: Joi.Schema
  secret_manager: SecretManagerServiceClient
  secret_name: string
  secret_version: string
}

export const jsonFromSecret = async (config: ValueFromSecretConfig) => {
  const { gcp_project_id, secret_manager, secret_name, secret_version } = config

  const str = await accessSecretVersion({
    project_id: gcp_project_id,
    secret_manager: secret_manager as any,
    secret_name,
    version: secret_version
  })

  if (config.schema) {
    const { error, value } = config.schema.validate(JSON.parse(str), {
      allowUnknown: true
    })
    if (error) {
      const details = [error.message]
      throw new Error(`${details.join('; ')}`)
    }
    return { value }
  } else {
    const value = JSON.parse(str)
    return { value }
  }
}
