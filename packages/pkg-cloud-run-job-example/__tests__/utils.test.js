// const supertest = require('supertest')
const { randomCocktail } = require('../src/utils.js')

describe(`randomCocktail`, () => {
  it('returns a drink`', async () => {
    const cocktail = await randomCocktail()

    expect(cocktail.idDrink).toBeDefined()
    expect(cocktail.strDrink).toBeDefined()
  })
})
