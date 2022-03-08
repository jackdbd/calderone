import { addSecretVersion } from '../lib/add-secret-version.js'
import { secretManagerClient } from './secret-manager-client.mjs'

const SECRET_NAME = 'TEST_SECRET'

const NONEXISTENT_SECRET = 'THIS_SECRET_DOES_NOT_EXIST'

const TIMEOUT_TEN_SECONDS = 10000

describe('addSecretVersion', () => {
  const secret_manager = secretManagerClient()

  it('throws when the secret does not exist', async () => {
    const payload = 'a simple string'

    expect(
      addSecretVersion({
        payload,
        secret_manager,
        secret_name: NONEXISTENT_SECRET
      })
    ).rejects.toThrow()
  })

  it(
    'can create a new version of the secret from a string',
    async () => {
      const payload = 'a simple string'

      const version = await addSecretVersion({
        payload,
        secret_manager,
        secret_name: SECRET_NAME
      })

      expect(version).toBeDefined()
      expect(version.state).toBe('ENABLED')
    },
    TIMEOUT_TEN_SECONDS
  )

  it(
    'can create a new version of the secret from JSON-stringified data',
    async () => {
      const payload = JSON.stringify({ foo: 'bar', answer: 42 })

      const version = await addSecretVersion({
        payload,
        secret_manager,
        secret_name: SECRET_NAME
      })

      expect(version).toBeDefined()
      expect(version.state).toBe('ENABLED')
    },
    TIMEOUT_TEN_SECONDS
  )
})
