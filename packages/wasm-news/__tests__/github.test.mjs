import { testServer } from '../dist/main-test.js'

describe('POST /github', () => {
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
      url: '/github'
    })
    expect(res.statusCode).toBe(400)
  })
})
