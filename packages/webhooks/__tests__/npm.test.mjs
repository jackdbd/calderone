import { hapiTestServer, webhookEvent } from './utils.mjs'

describe('POST /npm', () => {
  let server
  const timeout_ms = 10000

  beforeEach(async () => {
    server = await hapiTestServer()
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  })

  it('responds with 400 (Bad Request) when there is no payload', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/npm'
    })
    expect(res.statusCode).toBe(400)
  })

  it('responds with 200 when payload is a valid npm.js package:change webhook event', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/npm',
      payload: webhookEvent('npm-package-change.json')
    })
    expect(res.statusCode).toBe(200)
    expect(res.result.message).toContain('npm webhook processed successfully')
  })
})
