import Hapi from '@hapi/hapi'
import logger from '@jackdbd/hapi-logger-plugin'
import telegram from '@jackdbd/hapi-telegram-plugin'
import type { RequestEventMatcher } from '@jackdbd/hapi-telegram-plugin/interfaces'
import {
  isServerRequestError,
  isUnauthorizedRequestError
} from '@jackdbd/hapi-request-event-predicates'
import { serverError, unauthorized } from '@jackdbd/hapi-telegram-plugin/texts'
import hapi_dev_errors from 'hapi-dev-errors'
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
import HapiSwagger from 'hapi-swagger'
import { alertsPost } from './routes/alerts/post.js'
import { npmPost } from './routes/npm/post.js'
import { webPageTestPingbackGet } from './routes/webpagetest/get.js'
import { healthcheck } from '@jackdbd/hapi-healthcheck-plugin'
import {
  errorReporting,
  // firestore as firestoreClient,
  googleSheets,
  secretManager
} from './clients/index.js'
import { APP_NAME } from './constants.js'
import {
  environment as environment_schema,
  app_config as app_config_schema,
  google_sheets_config as google_sheets_config_schema,
  telegram_credentials as telegram_credentials_schema
} from './schemas.js'
import {
  throwIfNotOnNodeJs,
  jsonFromEnvVarOrSecret,
  jsonFromSecret
} from './utils.js'

export const app = async () => {
  throwIfNotOnNodeJs()

  const { error, value } = environment_schema.validate(process.env.NODE_ENV)
  if (error) {
    throw new Error(error.message)
  }
  const environment = value as string

  const port = process.env.PORT || 8080

  const { client: secret_manager, message: secret_manager_message } =
    secretManager()

  const gcp_project_id = await secret_manager.getProjectId()

  const { value: config, message: config_message } =
    await jsonFromEnvVarOrSecret({
      description: 'App config',
      environment_variable: 'APP_CONFIG',
      gcp_project_id,
      schema: app_config_schema,
      secret_manager,
      secret_name: `WEBHOOKS_CONFIG_${environment.toUpperCase()}`,
      secret_version: 'latest'
    })

  const {
    app_business_name,
    google_sheets_environment_variable,
    google_sheets_secret_name,
    google_sheets_secret_version,
    service_account_webperf_audit_secret_name,
    service_account_webperf_audit_secret_version,
    // stripe_api_key_environment_variable,
    // stripe_api_key_secret_name,
    // stripe_api_key_secret_version,
    // stripe_webhooks_environment_variable,
    // stripe_webhooks_secret_name,
    // stripe_webhooks_secret_version,
    telegram_environment_variable,
    telegram_secret_name,
    telegram_secret_version
  } = config

  // https://cloud.google.com/run/docs/container-contract#env-vars
  // https://stackoverflow.com/questions/72755708/how-to-retrieve-name-and-revision-of-a-cloud-run-service-from-the-service-itsel
  //   const cloud_run_region_id = 'europe-west3'
  const cloud_run_service_id = process.env.K_SERVICE || APP_NAME
  const cloud_run_service_version = 'latest'

  const { client: error_reporting, message: error_reporting_message } =
    errorReporting({
      cloud_run_service_id,
      cloud_run_service_version
    })

  // const { client: firestore, message: firestore_message } = firestoreClient()

  const { value: google_sheets_config, message: google_sheets_config_message } =
    await jsonFromEnvVarOrSecret({
      description: 'Google Sheets ID => worksheet tab mapping',
      environment_variable: google_sheets_environment_variable,
      gcp_project_id,
      schema: google_sheets_config_schema,
      secret_manager,
      secret_name: google_sheets_secret_name,
      secret_version: google_sheets_secret_version
    })

  const { value: sa_webperf_audit } = await jsonFromSecret({
    gcp_project_id,
    secret_manager,
    secret_name: service_account_webperf_audit_secret_name,
    secret_version: service_account_webperf_audit_secret_version
  })

  //
  const { client_email, private_key } = sa_webperf_audit

  const doc = await googleSheets({
    sheet_id: google_sheets_config['performance_audit'],
    credentials: { client_email, private_key }
  })

  const { value: telegram_credentials, message: telegram_credentials_message } =
    await jsonFromEnvVarOrSecret({
      description: 'Telegram chat ID and bot token',
      environment_variable: telegram_environment_variable,
      gcp_project_id,
      schema: telegram_credentials_schema,
      secret_manager,
      secret_name: telegram_secret_name,
      secret_version: telegram_secret_version
    })
  const { chat_id: telegram_chat_id, token: telegram_token } =
    telegram_credentials

  const server = Hapi.server({
    // disable Hapi debug logging, since I don't particulary like it (I prefer
    // writing my own loggers for development/production)
    debug: false,
    // debug: { log: ['*'], request: ['*'] },
    port
  })

  // PLUGIN BEGIN //////////////////////////////////////////////////////////////

  await server.register({
    plugin: hapi_dev_errors,
    options: {
      showErrors: environment !== 'production'
    }
  })

  // Inert and Vision are required by hapi-swagger if you want to view the
  // documentation from your API.
  await server.register(Inert)
  await server.register(Vision)
  await server.register({
    plugin: HapiSwagger,
    options: {
      documentationPath: '/docs',
      info: {
        title: `API Documentation for ${cloud_run_service_id}`,
        version: cloud_run_service_version
      }
    }
  })

  if (process.env.NODE_ENV !== 'test') {
    await server.register({
      plugin: logger,
      options: {
        namespace: process.env.NODE_ENV === 'development' ? APP_NAME : undefined
      }
    })
  }

  server.log(['debug', 'configuration'], { message: config_message })

  server.log(['debug', 'configuration', 'secret-manager'], {
    message: secret_manager_message
  })

  server.log(['debug', 'configuration', 'error-reporting'], {
    message: error_reporting_message
  })

  // server.log(['debug', 'configuration', 'firestore'], {
  //   message: firestore_message
  // })

  server.log(['debug', 'configuration', 'google-sheets'], {
    message: google_sheets_config_message
  })

  server.log(['debug', 'configuration', 'telegram'], {
    message: telegram_credentials_message
  })

  if (process.env.NODE_ENV !== 'test') {
    // https://github.com/googleapis/nodejs-error-reporting/tree/main
    await server.register({ plugin: error_reporting.hapi })
  }

  await server.register({
    plugin: healthcheck,
    options: {
      response_message_when_healthy: "Yo! I'm healthy!!!"
    }
  })

  const request_event_matchers: RequestEventMatcher[] = [
    {
      name: 'notify of any server error',
      predicate: isServerRequestError,
      text: serverError,
      chat_id: telegram_chat_id,
      token: telegram_token
    },
    {
      name: 'notify of any HTTP 401 Unauthorized (client error)',
      predicate: isUnauthorizedRequestError,
      text: unauthorized,
      chat_id: telegram_chat_id,
      token: telegram_token
    }
  ]

  await server.register({
    plugin: telegram,
    options: {
      request_event_matchers
    }
  })

  // PLUGIN END ////////////////////////////////////////////////////////////////

  // ROUTES BEGIN //////////////////////////////////////////////////////////////

  server.route({
    path: '/favicon.ico',
    method: 'GET',
    handler: () => {
      return { message: "don't mind the  favicon" }
    }
  })

  server.route(
    alertsPost({
      service_name: cloud_run_service_id,
      service_version: cloud_run_service_version,
      telegram_chat_id,
      telegram_token
    })
  )

  server.route(
    npmPost({
      telegram_chat_id,
      telegram_token
    })
  )

  // The following note was for hapi-ip-whitelist-plugin, that I no longer use.
  // allow 127.0.0.1 in development, so the ngrok public URL can be set as
  // WebPageTest pingback.
  // Reminder: ngrok public URL will be tunneled to 127.0.0.1 with this command:
  // ngrok http 8080
  // const ips_allowed_for_webpagetest_pingback =
  //   environment === 'development'
  //     ? [...webpagetest_tester_ips, '127.0.0.1']
  //     : webpagetest_tester_ips

  server.route(
    webPageTestPingbackGet({
      doc,
      service_name: cloud_run_service_id,
      service_version: cloud_run_service_version,
      telegram_chat_id,
      telegram_token
    })
  )

  // ROUTES END ////////////////////////////////////////////////////////////////

  return { app_business_name, environment, server }
}
