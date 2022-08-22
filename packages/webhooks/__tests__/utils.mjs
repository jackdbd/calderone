import fs from 'node:fs'
import path from 'node:path'
// import { monorepoRoot } from '@jackdbd/utils'
import { app } from '../dist/app.js'

// const WEBHOOK_EVENTS_DIR = path.join(monorepoRoot(), 'assets', 'webhook-events')
const WEBHOOK_EVENTS_DIR = path.resolve('assets', 'webhook-events')

export const hapiTestServer = async () => {
  const { server } = await app()
  return server
}

export const webhookEvent = (filename) => {
  const webhook_event_path = path.join(WEBHOOK_EVENTS_DIR, filename)
  return JSON.parse(fs.readFileSync(webhook_event_path, { encoding: 'utf8' }))
}
