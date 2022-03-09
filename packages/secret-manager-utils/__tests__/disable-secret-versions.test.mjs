import { addSecretVersion } from '../lib/add-secret-version'
import { disableSecretVersionsMatchingFilter } from '../lib/disable-secret-versions.js'
import { secretManagerClient } from './secret-manager-client.mjs'

const SECRET_NAME = 'TEST_SECRET'

const NONEXISTENT_SECRET = 'THIS_SECRET_DOES_NOT_EXIST'

const TIMEOUT_TEN_SECONDS = 10000

describe('disableSecretVersionsMatchingFilter', () => {
  const secret_manager = secretManagerClient()

  it('throws when the secret does not exist', async () => {
    const payload = 'a simple string'

    expect(
      disableSecretVersionsMatchingFilter({
        filter: 'state:ENABLED',
        secret_manager,
        secret_name: NONEXISTENT_SECRET
      })
    ).rejects.toThrow()
  })

  // this test is very slow (~6-7s)
  it(
    'disables all versions that match the given `filter`',
    async () => {
      const secret_name = SECRET_NAME

      const version_one = await addSecretVersion({
        payload: 'a simple string',
        secret_manager,
        secret_name
      })

      const version_two = await addSecretVersion({
        payload: JSON.stringify({ foo: 'bar', answer: 42 }),
        secret_manager,
        secret_name
      })

      const { disabled } = await disableSecretVersionsMatchingFilter({
        filter: `etag:${version_one.etag} OR name:${version_two.name}`,
        secret_manager,
        secret_name
      })

      expect(disabled.length).toBe(2)
    },
    TIMEOUT_TEN_SECONDS
  )
})
