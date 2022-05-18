import { isOnCloudBuild } from '../../checks/lib/environment.js'
import { monorepoRoot } from '../lib/path.js'

describe('monorepoRoot', () => {
  it('contains the expected string', () => {
    const expected = isOnCloudBuild(process.env) ? '/workspace' : 'calderone'
    expect(monorepoRoot()).toContain(expected)
  })
})
