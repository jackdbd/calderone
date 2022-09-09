const makeDebug = require('debug')
const { APP_NAME } = require('./constants.js')
const { wait1000Ms, randomCocktail } = require('./utils.js')

const debug = makeDebug(`${APP_NAME}/index`)

Promise.resolve({ started: new Date().toUTCString() })
  .then(async (m) => {
    const cocktail = await randomCocktail()
    debug(`fetched cocktail ${cocktail.strDrink}`)
    return { ...m, cocktail }
  })
  .then(async (m) => {
    await wait1000Ms()
    debug(`waited 1000ms`)
    return { ...m, waited: 1000 }
  })
  .then(async (m) => {
    await wait1000Ms()
    debug(`waited 1000ms`)
    return { ...m, waited: m.waited + 1000 }
  })
  .then(async (m) => {
    return {
      ...m,
      completed: new Date().toUTCString()
    }
  })
  .then((m) => {
    debug(`%O`, m)
    console.log(m)
  })
  .catch(console.error)
