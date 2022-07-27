import Joi from 'joi'
import type { AppConfig, TelegramCredentials } from './interfaces.js'

export const app_business_name = Joi.string().min(1)

export const environment = Joi.string().valid(
  'development',
  'production',
  'test'
)

export const environment_variable_name = Joi.string().min(1)

export const secret_manager_secret_name = Joi.string().min(1)

export const secret_manager_secret_version = Joi.string().min(1)

export const app_config = Joi.object<AppConfig>().keys({
  app_business_name: app_business_name.required(),

  google_sheets_environment_variable: environment_variable_name.required(),
  google_sheets_secret_name: secret_manager_secret_name.required(),
  google_sheets_secret_version: secret_manager_secret_version.required(),

  service_account_webperf_audit_secret_name:
    secret_manager_secret_name.required(),
  service_account_webperf_audit_secret_version:
    secret_manager_secret_version.required(),

  // stripe_api_key_environment_variable: environment_variable_name.required(),
  // stripe_api_key_secret_name: secret_manager_secret_name.required(),
  // stripe_api_key_secret_version: secret_manager_secret_version.required(),

  // stripe_webhooks_environment_variable: environment_variable_name.required(),
  // stripe_webhooks_secret_name: secret_manager_secret_name.required(),
  // stripe_webhooks_secret_version: secret_manager_secret_version.required(),

  telegram_environment_variable: environment_variable_name.required(),
  telegram_secret_name: secret_manager_secret_name.required(),
  telegram_secret_version: secret_manager_secret_version.required()
})

interface NameToWorksheetTabIdMapping {
  [k: string]: string
}

export const google_sheets_config = Joi.object<NameToWorksheetTabIdMapping>()

const telegram_chat_id = Joi.alternatives().try(
  Joi.number(),
  Joi.string().min(1)
)

const telegram_token = Joi.string().min(1)

export const telegram_credentials = Joi.object<TelegramCredentials>().keys({
  chat_id: telegram_chat_id.required(),
  token: telegram_token.required()
})
