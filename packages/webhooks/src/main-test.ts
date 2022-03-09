import { env } from 'node:process'
import { app } from './app.js'
import { config } from './config.js'

export const initTestServer = async () => {
  const cfg = await config({
    ...env,
    NODE_ENV: 'test'
  })
  const { server } = await app(cfg)
  return server
}
