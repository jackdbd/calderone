import path from 'node:path'
import { fsStore } from '../../lib/tokens-stores/fs.js'
import { monorepoRoot } from '../../lib/utils.js'

describe('fsStore', () => {
  it('can persist and retrieve', () => {
    const filepath = path.join(monorepoRoot(), 'secrets', 'keap.json')
    const store = fsStore(filepath)

    expect(store).toHaveProperty('persist')
    expect(store).toHaveProperty('retrieve')
  })
})
