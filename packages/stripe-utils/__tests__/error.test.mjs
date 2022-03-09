import { errorFromStripe } from '../lib/errors.js'

describe('errorFromStripe', () => {
  it('has a `message` property', () => {
    const err = errorFromStripe(new Error('foo'))

    expect(err).toHaveProperty('message')
    expect(err).toHaveProperty('code')
    expect(err).toHaveProperty('status_code')
  })
})
