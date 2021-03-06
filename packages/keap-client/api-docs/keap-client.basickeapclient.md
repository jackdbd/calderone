<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/keap-client](./keap-client.md) &gt; [basicKeapClient](./keap-client.basickeapclient.md)

## basicKeapClient variable

<b>Signature:</b>

```typescript
basicKeapClient: ({ access_token, client_id, client_secret, refresh_token }: BasicKeapClientConfig) => {
    contacts: {
        retrieve: (options: import("./contacts/api.js").RetrieveContactsOptions) => Promise<{
            data: import("./contacts/interfaces.js").Contact[];
            count: number;
            next: string;
            previous: string;
        }>;
        retrieveAsyncGenerator: (options: import("./contacts/api.js").RetrieveContactsOptions) => Promise<AsyncGenerator<import("./contacts/interfaces.js").PaginatedContactsClientResponse, void, unknown>>;
        retrieveById: (id: number, options: import("./contacts/api.js").RetrieveContactOptions) => Promise<import("./contacts/interfaces.js").ResponseBody>;
        retrieveByQueryString: (qs: string, options: import("./contacts/api.js").RetrieveContactsOptions) => Promise<import("./contacts/interfaces.js").PaginatedContactsClientResponse>;
        retrieveByEmail: (email: string, options: import("./contacts/api.js").RetrieveContactsOptions) => Promise<import("./contacts/interfaces.js").PaginatedContactsClientResponse>;
    };
    tokens: {
        tokens: (options?: import("./tokens/basic-client.js").RefreshedTokensOptions) => Promise<{
            access_token: string;
            expires_in: number;
            refresh_token: string;
            scope: string;
            token_type: "bearer";
        }>;
    };
}
```
