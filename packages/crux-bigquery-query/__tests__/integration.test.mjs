import supertest from 'supertest'
import { getTestServer } from '@google-cloud/functions-framework/testing'
// https://github.com/GoogleCloudPlatform/functions-framework-nodejs/blob/master/src/testing.ts
// https://github.com/GoogleCloudPlatform/functions-framework-nodejs/blob/master/docs/testing-functions.md
// we need to import the function, so functions-framework/testing can register it
import * as _ from '../index.js'
import { jsonStringSecret } from './utils.mjs'

const functionName = 'runQueryOnCrUX'

// it seems even Google recommends to force exit the Jest process
// https://cloud.google.com/functions/docs/testing/test-http

describe(`integration tests for ${functionName}`, () => {
  const TELEGRAM_original = process.env.TELEGRAM
  const TIMEOUT_MS_POST_REQUEST = 15000

  let server
  beforeAll(() => {
    server = getTestServer(functionName)
  })

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

  it('returns HTML when making a GET request', async () => {
    const response = await supertest(server).get('/').send()

    expect(response.statusCode).toBe(200)
    expect(response.text).toContain('<!DOCTYPE html>')
  })

  it('returns HTTP 415 when making a DELETE request', async () => {
    const response = await supertest(server).delete('/').send()

    expect(response.statusCode).toBe(415)
  })

  it('returns HTTP 415 when making a PUT request', async () => {
    const response = await supertest(server).put('/').send()

    expect(response.statusCode).toBe(415)
  })

  // this test works but takes a long time and reads a lot of data in BigQuery
  it.skip(
    'returns HTTP 200 when making a POST request',
    async () => {
      const response = await supertest(server).post('/').send()

      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('message')
    },
    TIMEOUT_MS_POST_REQUEST
  )
})
