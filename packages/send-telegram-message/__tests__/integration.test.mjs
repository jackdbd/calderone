import supertest from 'supertest'
import { getTestServer } from '@google-cloud/functions-framework/testing'
// https://github.com/GoogleCloudPlatform/functions-framework-nodejs/blob/master/src/testing.ts
// we need to import the function, so functions-framework/testing can register it
import * as _ from '../index.js'

const FUNCTION_NAME = 'send-telegram-message'

describe(`integration tests for ${FUNCTION_NAME}`, () => {
  let server
  beforeAll(() => {
    server = getTestServer(FUNCTION_NAME)
  })

  it('returns a HTTP 400 when request body has no `text`', async () => {
    const response = await supertest(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send({})

    expect(response.statusCode).toBe(400)
    expect(response.ok).toBeFalsy()
    expect(response.body.message).toBe('`text` not set')
  })

  it('returns a HTTP 200 when request body has a valid `text`', async () => {
    const response = await supertest(server)
      .post('/')
      .set('Content-Type', 'application/json')
      // https://core.telegram.org/bots/api#formatting-options
      .send({ text: '<b>Hello</b> from <code>Jest</code>' })

    expect(response.statusCode).toBe(200)
    expect(response.ok).toBeTruthy()
    expect(response.body.delivered).toBeTruthy()
    expect(response.body.message).toContain('delivered to chat')
  })
})
