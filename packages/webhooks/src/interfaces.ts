export interface AppConfig {
  app_business_name: string

  google_sheets_environment_variable: string
  google_sheets_secret_name: string
  google_sheets_secret_version: string

  service_account_webperf_audit_secret_name: string
  service_account_webperf_audit_secret_version: string

  stripe_api_key_environment_variable: string
  stripe_api_key_secret_name: string
  stripe_api_key_secret_version: string

  stripe_webhooks_environment_variable: string
  stripe_webhooks_secret_name: string
  stripe_webhooks_secret_version: string

  telegram_environment_variable: string
  telegram_secret_name: string
  telegram_secret_version: string
}

export interface StripeWebhooksConfig {
  endpoint: string
  signing_secret: string
}

export interface TelegramCredentials {
  chat_id: string
  token: string
}
