import { hashesStyleSrcElem } from '../lib/hash.js'

describe('hashesStyleSrcElem', () => {
  it('produces the expected hashes', async () => {
    const patterns = ['../../assets/html-pages/**/*.html']

    const hashes_256 = await hashesStyleSrcElem({
      algorithm: 'sha256',
      patterns
    })

    const hashes_384 = await hashesStyleSrcElem({
      algorithm: 'sha384',
      patterns
    })

    const hashes_512 = await hashesStyleSrcElem({
      algorithm: 'sha512',
      patterns
    })

    expect(hashes_256.length).toBe(1)
    expect(hashes_384.length).toBe(1)
    expect(hashes_512.length).toBe(1)

    hashes_256.forEach((hash_256, i) => {
      const hash_384 = hashes_384[i]
      const hash_512 = hashes_512[i]

      expect(hash_384).not.toBe(hash_256)
      expect(hash_512).not.toBe(hash_256)
      expect(hash_512).not.toBe(hash_384)

      expect(hash_256.length).toBe(51)
      expect(hash_384.length).toBe(71)
      expect(hash_512.length).toBe(95)
    })
  })
})
