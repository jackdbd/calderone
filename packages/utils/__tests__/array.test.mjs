import { fisherYatesShuffle, range, partitions } from '../lib/array.js'

describe('fisherYatesShuffle', () => {
  it(`does not alter the array's length`, () => {
    let arr = range(1, 10, 2)
    expect(arr).toHaveLength(5)

    fisherYatesShuffle(arr)
    expect(arr).toHaveLength(5)
  })

  it(`does not alter the array's elements`, () => {
    let arr = range(1, 10, 2)
    expect(arr).toContain(1)
    expect(arr).toContain(3)
    expect(arr).toContain(5)
    expect(arr).toContain(7)
    expect(arr).toContain(9)

    fisherYatesShuffle(arr)
    expect(arr).toContain(1)
    expect(arr).toContain(3)
    expect(arr).toContain(5)
    expect(arr).toContain(7)
    expect(arr).toContain(9)
  })
})

describe('range', () => {
  it('returns an array containing the expected numbers', () => {
    const arr = range(3, 9, 2)

    expect(arr).toContain(3)
    expect(arr).not.toContain(4)
    expect(arr).toContain(5)
    expect(arr).not.toContain(6)
    expect(arr).toContain(7)
    expect(arr).not.toContain(8)
    expect(arr).not.toContain(9)
  })
})

describe('partitions', () => {
  const arr = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n'
  ]

  it('returns 4 partitions when size is 3, each one with 3 elements', () => {
    const size = 3
    const chunks = partitions({ arr, size })

    expect(chunks).toHaveLength(4)
    chunks.forEach((chunk) => {
      expect(chunk).toHaveLength(size)
    })
  })

  it('returns 5 partitions when size is 3 and include_remainder is true, all but the last one with 3 elements, the last one with 2 elements', () => {
    const size = 3
    const chunks = partitions({ arr, size, include_remainder: true })

    expect(chunks).toHaveLength(5)
    chunks.forEach((chunk, i) => {
      if (i === chunks.length - 1) {
        expect(chunk).toHaveLength(2)
      } else {
        expect(chunk).toHaveLength(size)
      }
    })
  })
})
