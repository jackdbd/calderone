const makeDebug = require('debug')
const phin = require('phin')
const { APP_NAME } = require('./constants.js')

const debug = makeDebug(`${APP_NAME}/utils`)

const makeWaitMs = (ms) => {
  return async function waitMs() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`finished waiting ${ms}ms`)
      }, ms)
      debug(`started waiting ${ms} ms`)
    })
  }
}

const wait1000Ms = makeWaitMs(1000)

const randomCocktail = async () => {
  debug(`fetch a random cocktail from  thecocktaildb.com`)
  const response = await phin({
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET',
    parse: 'json',
    url: 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
  })

  return response.body.drinks[0]
}

module.exports = { makeWaitMs, wait1000Ms, randomCocktail }
