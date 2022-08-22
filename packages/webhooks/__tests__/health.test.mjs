import { hapiTestServer } from './utils.mjs'

describe('GET /health', () => {
  let server
  const timeout_ms = 10000

  beforeEach(async () => {
    server = await hapiTestServer()
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  })

  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/health'
    })
    expect(res.statusCode).toBe(200)
    expect(res.result.healthy).toBeTruthy()
  })
})
