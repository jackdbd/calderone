import phin from 'phin'
import { cocktailText } from '../lib/cocktail.js'

describe('cocktailText', () => {
  it('wraps `name` in a <b> tag', async () => {
    const response = await phin({
      method: 'GET',
      parse: 'json',
      url: 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
    })
    const drink = response.body.drinks[0]
    // console.log('🚀 drink', drink)

    //  strIngredient1 - strIngredient15
    //  strMeasure1 -  strMeasure15

    const text = cocktailText({
      category: drink.strCategory,
      glass: drink.strGlass,
      is_alcoholic: drink.strAlcoholic === 'Alcoholic' ? true : false,
      name: drink.strDrink,
      //   preparation: drink.strInstructionsIT,
      preparation: drink.strInstructions,
      thumbnail: drink.strDrinkThumb
    })

    expect(text).toContain(`<b>${drink.strDrink}</b>`)
  })
})
