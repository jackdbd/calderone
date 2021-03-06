<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/secret-manager-utils](./secret-manager-utils.md) &gt; [disableSecretVersionsMatchingFilter](./secret-manager-utils.disablesecretversionsmatchingfilter.md)

## disableSecretVersionsMatchingFilter variable

Disable all versions of a secret that match the given string `filter`<!-- -->.

See here: https://cloud.google.com/secret-manager/docs/filtering

<b>Signature:</b>

```typescript
disableSecretVersionsMatchingFilter: ({ filter, project_id, secret_manager, secret_name }: Config) => Promise<{
    message: string;
    disabled: {
        name?: string | undefined;
        etag?: string | undefined;
    }[];
}>
```
