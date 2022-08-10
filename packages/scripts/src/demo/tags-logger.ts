import PrettyError from 'pretty-error'
import { makeLog } from '@jackdbd/tags-logger'
import type { Options } from '@jackdbd/tags-logger'

const main = () => {
  const statements = [
    {
      message: 'this is a statement about foo',
      tags: ['debug', 'foo']
    },
    {
      message: 'this is a statement about foo with a lot of stuff',
      tags: ['debug', 'foo'],
      stuff: {
        hello: 'world',
        good: 'stuff',
        nested: { field: { hi: 'there' } },
        'nested-again': { some: 123 }
      }
    },
    {
      message: 'this is a statement about bar',
      tags: ['warning', 'bar'],
      stuff: { hello: 'world', good: 'stuff' }
    },
    {
      message: 'this is a statement about foo and bar',
      tags: ['debug', 'foo', 'bar'],
      stuff: { hello: 'world', good: 'stuff' }
    },
    {
      message: 'this is a statement about baz',
      tags: ['error', 'baz']
    },
    {
      message: 'this is a statement about bar and baz',
      tags: ['critical', 'bar', 'baz'],
      other_stuff: { hello: 'world', good: 'stuff' }
    },
    {
      message: 'this is a statement about foo, bar and baz',
      tags: ['info', 'foo', 'bar', 'baz']
    },
    {
      message: `don't panic`,
      tags: ['alert', 'foo', 'bar', 'baz']
    },
    {
      message: `ok, you can panic`,
      tags: ['emergency', 'foo', 'bar', 'baz']
    }
  ]

  const configs: Options[] = [
    {
      namespace: 'demo-tags-logger/foo',
      should_validate_log_statements: true
    },
    {
      namespace: 'demo-tags-logger/bar-emoji',
      should_use_emoji_for_severity: true,
      should_validate_log_statements: true
    },
    {
      namespace: 'demo-tags-logger/bar-severity',
      should_use_emoji_for_severity: false,
      should_validate_log_statements: true
    },
    {}
  ]

  const logFunctions = [undefined, ...configs].map((config) => {
    return makeLog(config)
  })

  const pe = new PrettyError()

  logFunctions.forEach((log, i) => {
    console.log(`=== DEMO CONFIGURATION ${i} ===`)
    try {
      statements.forEach((stmt) => {
        log(stmt)
      })
    } catch (err: any) {
      console.log(pe.render(err))
    }
  })
}

main()
