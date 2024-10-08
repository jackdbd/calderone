<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/tags-logger](./tags-logger.md)

## tags-logger package

A logger inspired by how logging is implemented in Hapi.js.

## Functions

<table><thead><tr><th>

Function


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[makeLog(options)](./tags-logger.makelog.md)


</td><td>

Factory that returns a `log` function that will either print structured or unstructured log statements, with optional schema validation for each log statement in both cases.

Each log statement you pass to the `log` function returned to this logger should have (and \*\*must\*\* have if you validate the log statements) a `message` and a `tags` array.

Unstructured logging is delegated to the \[debug\](https://github.com/debug-js/debug) library. For example, if you set the environment variable `DEBUG` to `DEBUG=app/*,-app/foo`<!-- -->, the log function will print everything matching `app/*`<!-- -->, except `app/foo`<!-- -->.


</td></tr>
</tbody></table>

## Interfaces

<table><thead><tr><th>

Interface


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[Options](./tags-logger.options.md)


</td><td>

Options for the logger.


</td></tr>
<tr><td>

[Statement](./tags-logger.statement.md)


</td><td>

Shape of each log statement.


</td></tr>
</tbody></table>

## Variables

<table><thead><tr><th>

Variable


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[statement](./tags-logger.statement.md)


</td><td>

Joi schema to validate each log statement against.


</td></tr>
</tbody></table>
