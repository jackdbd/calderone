import { denyAllServer, allowLocalhostServer, MESSAGE } from './utils.mjs'

describe('GET / (unauthorized)', () => {
  let server
  const timeout_ms = 10000

  beforeAll(async () => {
    server = await denyAllServer()
  }, timeout_ms)

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  }, timeout_ms)

  it('responds with 401', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/'
    })
    expect(res.statusCode).toBe(401)
  })

  it('responds with the expected message', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/'
    })
    expect(res.result.message).toBe(
      '127.0.0.1 is not allowed to access this route'
    )
  })
})

describe('GET / (allowed)', () => {
  let server
  const timeout_ms = 10000

  beforeAll(async () => {
    server = await allowLocalhostServer()
  }, timeout_ms)

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  }, timeout_ms)

  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/'
    })
    expect(res.statusCode).toBe(200)
  })

  it('responds with the expected message', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/'
    })
    expect(res.result.message).toBe(MESSAGE)
  })
})
