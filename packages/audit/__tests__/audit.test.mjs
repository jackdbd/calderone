import { testServer } from '../dist/main-test.js'

describe('POST /audit', () => {
  let server
  const timeout_ms = 10000

  beforeAll(async () => {
    server = await testServer()
  }, timeout_ms)

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  }, timeout_ms)

  it('responds with 400 when there is no payload', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/audit'
    })
    expect(res.statusCode).toBe(400)
  })

  it('responds with 400 when payload.limit is -1', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/audit',
      payload: { limit: -1 }
    })
    expect(res.statusCode).toBe(400)
  })

  it('responds with 200 when payload.limit is 10', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/audit',
      payload: { limit: 10 }
    })
    expect(res.statusCode).toBe(200)
    expect(res.result.message).toContain('Google Worksheet')
  })
})
