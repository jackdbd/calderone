<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/sqlite-utils](./sqlite-utils.md)

## sqlite-utils package

A few functions useful when working with \[better-sqlite3\](https://github.com/WiseLibs/better-sqlite3).

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [BulkInsertConfig](./sqlite-utils.bulkinsertconfig.md) |  |
|  [ColumnInfo](./sqlite-utils.columninfo.md) |  |
|  [ForeignKey](./sqlite-utils.foreignkey.md) |  |

## Variables

|  Variable | Description |
|  --- | --- |
|  [bulkInsert](./sqlite-utils.bulkinsert.md) | Creates a SQLite transaction that will run a SQL statement on each record and either commit the results, or rollback to the original state of the database. |
|  [DEPRECATED\_PRAGMAS](./sqlite-utils.deprecated_pragmas.md) | Complete list of \*\*deprecated\*\* SQLite PRAGMA statements. |
|  [foreignKeys](./sqlite-utils.foreignkeys.md) | Returns an array of all the foreign key constraints of the requested table. |
|  [pragmaDict](./sqlite-utils.pragmadict.md) | <p>Returns a dictionary of the available PRAGMA statements in this SQLite database, where each key-value pair is a PRAGMA with its associated value.</p><p>PRAGMA statements not available in the provided SQLite database will not show up in the dictionary.</p> |
|  [PRAGMAS](./sqlite-utils.pragmas.md) | Complete list of \*\*non-deprecated\*\* SQLite PRAGMA statements. |
|  [tableInfo](./sqlite-utils.tableinfo.md) | Returns an array where each item is a piece of information about a column of the requested table. |

