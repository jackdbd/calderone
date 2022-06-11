import fs from 'node:fs'
import path from 'node:path'
import { env } from 'node:process'
import { PREFIX_API_ERROR } from '../lib/errors.js'
import { topPages } from '../lib/stats/index.js'
import { isOnGithub } from '../../checks/lib/environment.js'
import { monorepoRoot } from '../../utils/lib/path.js'

const TEST_CACHE_DIRECTORY = '.cache-tests'
const TEST_CACHE_DURATION = '3s'

describe('topPages', () => {
  it('throws when no config is provided', async () => {
    expect(topPages()).rejects.toThrow()
  })

  it('throws when `apiKey` is undefined', async () => {
    expect(topPages({ apiKey: undefined })).rejects.toThrow()
  })

  it('throws when `siteId` is undefined', async () => {
    expect(
      topPages({ apiKey: 'some Plausible.io API key', siteId: undefined })
    ).rejects.toThrow()
  })

  it('rethrows an error originated from the Plausible API', async () => {
    expect(
      topPages({
        apiKey: 'some Plausible.io API key',
        siteId: 'example.com'
      })
    ).rejects.toThrowError(PREFIX_API_ERROR)
  })

  it('returns some results from the Plausible API', async () => {
    let json
    if (isOnGithub(env)) {
      json = env.PLAUSIBLE
    } else {
      const json_path = path.join(monorepoRoot(), 'secrets', 'plausible.json')
      json = fs.readFileSync(json_path).toString()
    }
    const secret = JSON.parse(json)
    const { api_key: apiKey, site_id: siteId } = secret

    const results = await topPages(
      {
        apiKey,
        siteId
      },
      {
        cacheDirectory: TEST_CACHE_DIRECTORY,
        cacheDuration: TEST_CACHE_DURATION
      }
    )

    expect(results).toBeDefined()
    expect(results.length).toBeGreaterThan(0)
  })

  it.todo('returns a cached response')
})
