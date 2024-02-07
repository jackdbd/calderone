import supertest from 'supertest'
import {
  getFunction,
  getTestServer
} from '@google-cloud/functions-framework/testing'
// https://github.com/GoogleCloudPlatform/functions-framework-nodejs/blob/master/src/testing.ts
// https://github.com/GoogleCloudPlatform/functions-framework-nodejs/blob/master/docs/testing-functions.md
// we need to import the function, so functions-framework/testing can register it
import * as _ from '../index.js'
import { jsonStringSecret } from './utils.mjs'

const functionName = 'authorizeCallbackUrl'

// it seems even Google recommends to force exit the Jest process
// https://cloud.google.com/functions/docs/testing/test-http

const TIMEOUT_MS = 5000

describe(`integration tests for ${functionName}`, () => {
  const TELEGRAM_original = process.env.TELEGRAM

  let server
  beforeAll(() => {
    server = getTestServer(functionName)
  })

  //   afterAll(() => {
  //     server.close((err, _value) => {
  //       if (err) {
  //         console.log('=== ERROR ===', err)
  //       }
  //     })
  //   }, TIMEOUT_MS)

  beforeEach(() => {
    process.env.TELEGRAM = jsonStringSecret({
      environment_variable_name: 'TELEGRAM',
      secret_filename: 'telegram.json'
    })
    server = getTestServer(functionName)
  })

  afterEach(() => {
    process.env.TELEGRAM = TELEGRAM_original
    // server.close()
  })

  it('returns HTTP 400 when URL has no `callback_url`', async () => {
    const response = await supertest(server)
      .get('/')
      // .set('Content-Type', 'application/json')
      .send()

    expect(response.statusCode).toBe(400)
    // expect(response.body.message).toContain('`callback_url` not set')
    expect(response.text).toContain('URL not authorized')
  })

  it('returns HTTP 400 when URL has no `workflow_id`', async () => {
    const response = await supertest(server)
      .get('/?callback_url=https://example.com')
      // .set('Content-Type', 'application/json')
      .send()

    expect(response.statusCode).toBe(400)
    // expect(response.body.message).toContain('`workflow_id` not set')
    expect(response.text).toContain('URL not authorized')
  })

  it('returns HTTP 400 when URL has no `location`', async () => {
    const response = await supertest(server)
      .get('/?callback_url=https://example.com&workflow_id=123')
      // .set('Content-Type', 'application/json')
      .send()

    expect(response.statusCode).toBe(400)
    // expect(response.body.message).toContain('`location` not set')
    expect(response.text).toContain('URL not authorized')
  })

  it('returns HTTP 400 when URL has no `execution_id`', async () => {
    const response = await supertest(server)
      .get(
        '/?callback_url=https://example.com&workflow_id=123&location=us-central1'
      )
      // .set('Content-Type', 'application/json')
      .send()

    expect(response.statusCode).toBe(400)
    // expect(response.body.message).toContain('`execution_id` not set')
    expect(response.text).toContain('URL not authorized')
  })

  it('returns HTTP 401 when URL is valid but credentials for Google Auth are not set', async () => {
    const callback_url = 'https://example.com'
    const workflow_id = `123`
    const location = 'us-central1'
    const execution_id = `456`

    const response = await supertest(server)
      .get(
        `/?callback_url=${callback_url}&workflow_id=${workflow_id}&location=${location}&execution_id=${execution_id}}`
      )
      // .set('Content-Type', 'application/json')
      .send()

    expect(response.statusCode).toBe(401)
    // expect(response.body.message).toContain('auth client')
    expect(response.text).toContain('URL not authorized')
  })

  it.skip('returns HTTP 403 when URL is valid and credentials for Google Auth are not set, but callback URL was not registered', async () => {
    const callback_url = 'https://example.com'
    const workflow_id = `123`
    const location = 'us-central1'
    const execution_id = `456`

    const response = await supertest(server)
      .get(
        `/?callback_url=${callback_url}&workflow_id=${workflow_id}&location=${location}&execution_id=${execution_id}}`
      )
      .set('Content-Type', 'application/json')
      .send()

    expect(response.statusCode).toBe(403)
    expect(response.body.message).toContain('auth client')
    // expect(response.body.message).toContain(callback_url)
    // expect(response.body.message).toContain(workflow_id)
    // expect(response.body.message).toContain(location)
    // expect(response.body.message).toContain(execution_id)
  })
})
