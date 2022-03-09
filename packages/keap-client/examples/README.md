# keap-client examples

## auto-pagination

[auto-pagination.mjs](./auto-pagination.mjs) shows how to auto-paginate responses from the Keap API.

```sh
npm run example:auto-pagination -w packages/keap-client
```

## basic-client

[basic-client.mjs](./basic-client.mjs) shows how to create the simplest Keap API clients: no retries, no auto-refresh for OAuth tokens, etc.

```sh
npm run example:basic-clients -w packages/keap-client
```

## build-db

[build-db.mjs](./build-db.mjs) shows how to store Keap contacts in SQLite, using a transaction for each paginated response from the Keap API.

```sh
npm run example:build-db -w packages/keap-client
```

## contacts-with-optional-properties

[contacts-with-optional-properties.mjs](./contacts-with-optional-properties.mjs) shows how to use `optional_properties` with `contacts.retrieve()`

```sh
npm run example:contacts-with-optional-properties -w packages/keap-client
```

*Note*: you can retrieve the list of optional_properties for you Keap contacts with a GET request to `https://api.infusionsoft.com/crm/rest/v1/contacts/model`.
