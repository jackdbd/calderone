import { accessSecretVersion } from '../lib/access-secret-version.js'
import { secretManagerClient } from './secret-manager-client.mjs'

const NONEXISTENT_SECRET = 'THIS_SECRET_DOES_NOT_EXIST'

describe('accessSecretVersion', () => {
  const secret_manager = secretManagerClient()

  it('throws when the secret does not exist', async () => {
    expect(
      accessSecretVersion({
        secret_manager,
        secret_name: NONEXISTENT_SECRET,
        version: 'latest'
      })
    ).rejects.toThrow()
  })
})
