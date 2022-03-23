import { initTestServer } from '../dist/main-test.js'

describe('GET /webpagetest', () => {
  let server
  const timeout_ms = 10000

  beforeEach(async () => {
    server = await initTestServer()
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  })

  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/webpagetest'
    })
    expect(res.statusCode).toBe(200)
    expect(res.result.message).toBe(
      'incoming GET request has no `id` in the query string'
    )
  })
})
