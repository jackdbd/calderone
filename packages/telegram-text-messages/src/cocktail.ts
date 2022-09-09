import { Emoji } from './constants.js'
import { genericText } from './generic-text.js'

export interface Config {
  category: string
  glass: string
  is_alcoholic: boolean
  name: string
  preparation: string
  thumbnail: string
}

/**
 * @see [TheCocktailDB API](https://www.thecocktaildb.com/api.php)
 */
export const cocktailText = ({
  category,
  glass,
  is_alcoholic,
  name,
  preparation,
  thumbnail
}: Config) => {
  const arr = [`category: ${category}`]

  const g = glass.toLowerCase()
  if (g.includes('collins') || g.includes('old-fashioned')) {
    arr.push(`${Emoji.TumblerGlass} ${glass}`)
  } else if (g.includes('cocktail')) {
    arr.push(`${Emoji.CocktailGlass} ${glass}`)
  } else {
    arr.push(`${Emoji.WineGlass} ${glass}`)
  }

  if (is_alcoholic) {
    arr.push(`alcoholic`)
  } else {
    arr.push(`non alcoholic`)
  }

  const description = `${preparation}\n\n${thumbnail}`

  return genericText({
    title: name,
    subtitle: arr.join('\n'),
    description,
    links: [
      { text: `TheCocktailDB`, href: `https://www.thecocktaildb.com/api.php` }
    ]
  })
}
