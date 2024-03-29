<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/tags-logger](./tags-logger.md)

## tags-logger package

A logger inspired by how logging is implemented in Hapi.js.

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [Options](./tags-logger.options.md) | Options for the logger. |
|  [Statement](./tags-logger.statement.md) | Shape of each log statement. |

## Variables

|  Variable | Description |
|  --- | --- |
|  [makeLog](./tags-logger.makelog.md) | <p>Factory that returns a <code>log</code> function that will either print structured or unstructured log statements, with optional schema validation for each log statement in both cases.</p><p>Each log statement you pass to the <code>log</code> function returned to this logger should have (and \*\*must\*\* have if you validate the log statements) a <code>message</code> and a <code>tags</code> array.</p><p>Unstructured logging is delegated to the \[debug\](https://github.com/debug-js/debug) library. For example, if you set the environment variable <code>DEBUG</code> to <code>DEBUG=app/*,-app/foo</code>, the log function will print everything matching <code>app/*</code>, except <code>app/foo</code>.</p> |
|  [statement](./tags-logger.statement.md) | Joi schema to validate each log statement against. |

