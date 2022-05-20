import { fisherYatesShuffle, range } from '../lib/array.js'

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
