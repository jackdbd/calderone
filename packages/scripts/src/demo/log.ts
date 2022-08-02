import Joi from 'joi'
import PrettyError from 'pretty-error'
import { makeLogger } from '@jackdbd/tags-logger'
import type { Options } from '@jackdbd/tags-logger'

const message = Joi.string().min(1)

const severity_values = [
  'debug',
  'info',
  'notice',
  'warning',
  'error',
  'critical',
  'alert',
  'emergency'
]

const severity_tag = Joi.string().valid(...severity_values)

const tag = Joi.string().min(1)

const hasOneSeverityTag = (a: string, b: string) => {
  if (severity_values.includes(a) && severity_values.includes(b)) {
    return true
  } else {
    return false
  }
}

const tags = Joi.array()
  .items(tag)
  .has(severity_tag)
  .unique()
  .unique(hasOneSeverityTag)

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

  const log_statement_with_forbidden_tags = Joi.object().keys({
    message: message.required(),
    tags: tags.forbidden()
  })

  const configs: Options[] = [
    {},
    {
      namespace: 'foo',
      should_throw_if_namespace_not_in_DEBUG: true,
      should_validate_log_statements: true
    },
    {
      namespace: 'foo',
      should_use_json_logger: true,
      should_validate_log_statements: true
    },
    {
      namespace: 'foo',
      should_throw_if_namespace_not_in_DEBUG: true,
      should_validate_log_statements: true,
      statement_schema: log_statement_with_forbidden_tags
    }
  ]

  const loggers = [undefined, ...configs].map((config) => {
    return makeLogger(config)
  })

  const pe = new PrettyError()

  loggers.forEach((log) => {
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
