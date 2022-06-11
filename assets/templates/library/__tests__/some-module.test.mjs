import { theAnswer } from '../lib/some-module.js'

describe('theAnswer', () => {
  it('is 42', () => {
    expect(theAnswer()).toBe(42)
  })
})
