import { env } from 'node:process'
import { testServer } from '../dist/main-test.js'

describe('route /', () => {
  let server
  const timeout_ms = 10000

  const json = env.TELEGRAM
  const secret = JSON.parse(json)
  const { chat_id } = secret
  const message = { message_id: 123, text: '/dice', chat: chat_id }

  beforeAll(async () => {
    server = await testServer()
  }, timeout_ms)

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  }, timeout_ms)

  describe('method GET', () => {
    it('responds with 200', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/'
      })
      expect(res.statusCode).toBe(200)
    })
  })

  describe('method POST', () => {
    it('responds with 400 when there is no payload', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/'
      })
      expect(res.statusCode).toBe(400)
    })

    it('responds with 400 when payload has no message', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/',
        payload: {}
      })
      expect(res.statusCode).toBe(400)
    })

    it('responds with 400 when payload has no update_id', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/',
        payload: {
          message
        }
      })
      expect(res.statusCode).toBe(400)
    })

    it('responds with 200 when payload has message and update_id', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/',
        payload: {
          message,
          update_id: 123
        }
      })
      expect(res.statusCode).toBe(200)
      expect(res.result.message).toBe('update processed')
    })
  })
})
