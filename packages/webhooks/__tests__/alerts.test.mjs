import { hapiTestServer, webhookEvent } from './utils.mjs'

describe('POST /alerts', () => {
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
      url: '/alerts'
    })
    expect(res.statusCode).toBe(400)
  })

  it('responds with 400 (Bad Request) when there is no payload.incident', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/alerts',
      payload: { foo: 'bar' }
    })
    expect(res.statusCode).toBe(400)
  })

  it('responds with 200 when payload is a valid Cloud Monitoring incident', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/alerts',
      payload: webhookEvent('monitoring-incident.json')
    })
    expect(res.statusCode).toBe(200)
    expect(res.result.message).toContain('received alert from GCP')
  })
})
