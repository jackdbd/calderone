import util from 'util'

const debuglog = util.debuglog('scripts/monad')

// type Bind<T> = (func: (value: T) => void) => void

type Monad<T> = (value: T) => {
  bind: (func: (value: T) => void) => Monad<T>
}

const makeMonad = <T>(): Monad<T> => {
  debuglog('makeMonad')
  const prototype = Object.create(null)

  const unit = (value: T) => {
    const monad: Monad<T> = Object.create(prototype)

    // const bind = (func) => {
    //   return func(value)
    // }

    monad.bind = (func: (value: T) => Monad<T>) => {
      return func(value)
    }

    return monad
  }

  return unit
}

const tap = (value: string) => {
  console.log('tap', value)
  debuglog(value)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return { bind: () => {} }
}

function MONAD() {
  return function unit(value: string) {
    const monad = Object.create(null)
    monad.bind = (func: any) => {
      return func(value)
    }

    return monad
  }
}

const main = () => {
  //   const identity = makeMonad<string>()
  const identity = MONAD()
  const monad = identity('hello')
  monad.bind(console.log)
  //   const another_monad = monad.bind(tap).bind(console.log)
  //   console.log('another_monad', another_monad)
}

main()
