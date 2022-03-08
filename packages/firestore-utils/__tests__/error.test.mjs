import { errorFromFirestore } from '../lib/error.js'

describe('errorFromFirestore', () => {
  it('has a `message` property', () => {
    const err = errorFromFirestore(new Error('foo'))

    expect(err).toHaveProperty('message')
    expect(err).toHaveProperty('status_code')
  })
})
