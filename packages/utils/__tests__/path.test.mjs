import { monorepoRoot } from '../lib/path.js'

describe('monorepoRoot', () => {
  it('contains the string `calderone`', () => {
    expect(monorepoRoot()).toContain('calderone')
  })
})
