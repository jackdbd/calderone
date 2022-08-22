import Exiting from 'exiting'
import { app } from './app.js'

/**
 * Provisions a Hapi.Server for the current environment.
 */
export const provision = async () => {
  // const cfg = await config(env)
  const { app_business_name, environment, server } = await app()

  const manager = Exiting.createManager([server], { exitTimeout: 10000 })
  await manager.start()
  // server.log(['lifecycle'], {

  // const sheet_url = `https://docs.google.com/spreadsheets/d/${cfg.sheet_id}/edit`
  // server.log(['lifecycle'], {
  //   message: `sheet ${cfg.sheet_title} can be found at ${sheet_url}`
  // })

  const message = `App ${app_business_name} provisioned for environment ${environment}`
  server.log(['debug', 'configuration', 'lifecycle'], { message })

  return { message }
}
