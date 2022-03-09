import {
  MESSAGE_WHEN_HEALTHY,
  MESSAGE_WHEN_UNHEALTHY,
  healthyServer,
  unhealthyServer
} from './utils.mjs'

describe('GET /health (healthy)', () => {
  let server
  const timeout_ms = 10000

  beforeAll(async () => {
    server = await healthyServer()
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
      url: '/health'
    })
    expect(res.statusCode).toBe(200)
  })

  it('is healthy', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/health'
    })
    expect(res.result.healthy).toBeTruthy()
  })

  it('responds with the expected message', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/health'
    })
    expect(res.result.message).toBe(MESSAGE_WHEN_HEALTHY)
  })
})

describe('GET /health (unhealthy)', () => {
  let server
  const timeout_ms = 10000

  beforeAll(async () => {
    server = await unhealthyServer()
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
      url: '/health'
    })
    expect(res.statusCode).toBe(503)
  })

  it('is not healthy', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/health'
    })
    expect(res.result.healthy).toBeFalsy()
  })

  it('responds with the expected message', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/health'
    })
    expect(res.result.message).toBe(MESSAGE_WHEN_UNHEALTHY)
  })
})
