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

  it('responds with 400', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/webpagetest'
    })
    expect(res.statusCode).toBe(400)
    expect(res.result.title).toBe(`Your request parameters didn't validate.`)
  })
})
