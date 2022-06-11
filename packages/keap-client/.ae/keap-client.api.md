## API Report File for "@jackdbd/keap-client"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// Warning: (ae-forgotten-export) The symbol "BasicKeapClientConfig" needs to be exported by the entry point index.d.ts
// Warning: (ae-missing-release-tag) "basicKeapClient" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const basicKeapClient: ({ access_token, client_id, client_secret, refresh_token }: BasicKeapClientConfig) => {
    contacts: {
        retrieve: (options: RetrieveContactsOptions) => Promise<{
            data: Contact[];
            count: number;
            next: string;
            previous: string;
        }>;
        retrieveAsyncGenerator: (options: RetrieveContactsOptions) => Promise<AsyncGenerator<PaginatedContactsClientResponse, void, unknown>>;
        retrieveById: (id: number, options: RetrieveContactOptions) => Promise<ResponseBody>;
        retrieveByQueryString: (qs: string, options: RetrieveContactsOptions) => Promise<PaginatedContactsClientResponse>;
        retrieveByEmail: (email: string, options: RetrieveContactsOptions) => Promise<PaginatedContactsClientResponse>;
    };
    tokens: {
        tokens: (options?: RefreshedTokensOptions) => Promise<{
            access_token: string;
            expires_in: number;
            refresh_token: string;
            scope: string;
            token_type: "bearer";
        }>;
    };
};

// Warning: (ae-forgotten-export) The symbol "StoreKeapClientConfig" needs to be exported by the entry point index.d.ts
// Warning: (ae-missing-release-tag) "storeKeapClient" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const storeKeapClient: ({ access_token, client_id, client_secret, refresh_token, store }: StoreKeapClientConfig) => {
    contacts: {
        retrieve: (options: RetrieveContactsOptions) => Promise<{
            data: Contact[];
            count: number;
            next: string;
            previous: string;
        }>;
        retrieveAsyncGenerator: (options: RetrieveContactsOptions) => Promise<AsyncGenerator<PaginatedContactsClientResponse, void, unknown>>;
        retrieveById: (id: number, options: RetrieveContactOptions) => Promise<ResponseBody>;
        retrieveByQueryString: (qs: string, options: RetrieveContactsOptions) => Promise<PaginatedContactsClientResponse>;
        retrieveByEmail: (email: string, options: RetrieveContactsOptions) => Promise<PaginatedContactsClientResponse>;
    };
    tokens: {
        persistRefreshedTokens: (options?: PersistRefreshedTokensOptions) => Promise<void>;
        tokens: () => Promise<Tokens>;
    };
};

// Warnings were encountered during analysis:
//
// src/clients.ts:21:25 - (ae-forgotten-export) The symbol "RetrieveContactsOptions" needs to be exported by the entry point index.d.ts
// src/clients.ts:21:25 - (ae-forgotten-export) The symbol "Contact" needs to be exported by the entry point index.d.ts
// src/clients.ts:21:25 - (ae-forgotten-export) The symbol "PaginatedContactsClientResponse" needs to be exported by the entry point index.d.ts
// src/clients.ts:21:25 - (ae-forgotten-export) The symbol "RetrieveContactOptions" needs to be exported by the entry point index.d.ts
// src/clients.ts:21:25 - (ae-forgotten-export) The symbol "ResponseBody" needs to be exported by the entry point index.d.ts
// src/clients.ts:21:25 - (ae-forgotten-export) The symbol "RefreshedTokensOptions" needs to be exported by the entry point index.d.ts
// src/clients.ts:42:25 - (ae-forgotten-export) The symbol "PersistRefreshedTokensOptions" needs to be exported by the entry point index.d.ts
// src/clients.ts:42:25 - (ae-forgotten-export) The symbol "Tokens" needs to be exported by the entry point index.d.ts

// (No @packageDocumentation comment for this package)

```