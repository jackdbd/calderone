import { secretManagerStore } from '../lib/store.js'
import { addSecretVersion } from '../lib/add-secret-version.js'
import { disableSecretVersionsMatchingFilter } from '../lib/disable-secret-versions.js'
import { secretManagerClient } from './secret-manager-client.mjs'

// a secret I created for testing
const SECRET_NAME = 'TEST_SECRET'

const NONEXISTENT_SECRET = 'THIS_SECRET_DOES_NOT_EXIST'

const TIMEOUT_TEN_SECONDS = 10000

describe('secretManagerStore', () => {
  const secret_manager = secretManagerClient()

  it('has the expected properties', () => {
    const store = secretManagerStore({
      secret_manager,
      secret_name: SECRET_NAME
    })

    expect(store).toHaveProperty('retrieve')
    expect(store).toHaveProperty('persist')
  })

  it('throws when the secret does not exist', async () => {
    const store = secretManagerStore({
      secret_manager,
      secret_name: NONEXISTENT_SECRET
    })

    expect(store.retrieve()).rejects.toThrow()
  })

  it(
    'throws when all secret versions are DISABLED',
    async () => {
      const payload = JSON.stringify({ foo: 'bar', answer: 42 })

      const version = await addSecretVersion({
        payload,
        secret_manager,
        secret_name: SECRET_NAME
      })
      expect(version.state).toBe('ENABLED')

      const { disabled } = await disableSecretVersionsMatchingFilter({
        filter: 'state:ENABLED',
        secret_manager,
        secret_name: SECRET_NAME
      })
      expect(disabled.length).toBeGreaterThan(0)

      const store = secretManagerStore({
        secret_manager,
        secret_name: SECRET_NAME
      })

      expect(store.retrieve()).rejects.toThrow()
    },
    TIMEOUT_TEN_SECONDS
  )

  it(
    'can retrieve data when there is at least one ENABLED version of the secret',
    async () => {
      const payload = JSON.stringify({ foo: 'bar', answer: 42 })

      const version = await addSecretVersion({
        payload,
        secret_manager,
        secret_name: SECRET_NAME
      })
      expect(version.state).toBe('ENABLED')

      const store = secretManagerStore({
        secret_manager,
        secret_name: SECRET_NAME
      })

      const data = await store.retrieve()

      expect(data).toBeDefined()
    },
    TIMEOUT_TEN_SECONDS
  )
})
