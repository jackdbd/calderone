import debugger_agent from '@google-cloud/debug-agent'
import Exiting from 'exiting'
import { app } from './app.js'
import { config } from './config.js'

/**
 * Provision and configure a Hapi.Server for the specified environment.
 */
export const provision = async (env: NodeJS.ProcessEnv) => {
  const cfg = await config(env)
  const { server } = await app(cfg)

  // https://github.com/kanongil/exiting
  const manager = Exiting.createManager([server], { exitTimeout: 10000 })
  server.log(['lifecycle'], {
    message: 'created manager to handle safe shutdown of server/s'
  })

  // https://github.com/googleapis/cloud-debug-nodejs/blob/main/src/agent/config.ts
  debugger_agent.start(cfg.debug_agent_config)
  server.log(['lifecycle'], { message: 'Cloud Debugger agent started' })

  await manager.start()
  server.log(['lifecycle'], {
    message: `server started on port ${cfg.port} [${cfg.environment}]`
  })

  server.log(['lifecycle'], {
    message: `Telegram messages will be sent to chat ${cfg.telegram_chat_id}`
  })

  const sheet_url = `https://docs.google.com/spreadsheets/d/${cfg.sheet_id}/edit`
  server.log(['lifecycle'], {
    message: `sheet ${cfg.sheet_title} can be found at ${sheet_url}`
  })

  const cloud_run_logs_href = `https://console.cloud.google.com/run/detail/${cfg.region_id}/${cfg.service_id}/logs?project=${cfg.project_id}`
  server.log(['lifecycle'], {
    message: `logs can be found at ${cloud_run_logs_href}`
  })

  return {
    app_name: cfg.service_name,
    app_version: cfg.service_version,
    cloud_run_logs_href,
    error_reporting: cfg.error_reporting,
    telegram_chat_id: cfg.telegram_chat_id,
    telegram_token: cfg.telegram_token
  }
}
