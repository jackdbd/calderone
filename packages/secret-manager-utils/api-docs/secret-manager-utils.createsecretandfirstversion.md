<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/secret-manager-utils](./secret-manager-utils.md) &gt; [createSecretAndFirstVersion](./secret-manager-utils.createsecretandfirstversion.md)

## createSecretAndFirstVersion() function

**Signature:**

```typescript
createSecretAndFirstVersion: ({ labels, project_id, secret_manager, secret_data, secret_id }: Config) => Promise<{
    secret: import("@google-cloud/secret-manager/build/protos/protos").google.cloud.secretmanager.v1.ISecret;
    version: import("@google-cloud/secret-manager/build/protos/protos").google.cloud.secretmanager.v1.ISecretVersion;
}>
```

## Parameters

<table><thead><tr><th>

Parameter


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

{ labels, project\_id, secret\_manager, secret\_data, secret\_id }


</td><td>

[Config](./secret-manager-utils.createsecretandfirstversionconfig.md)


</td><td>


</td></tr>
</tbody></table>
**Returns:**

Promise&lt;{ secret: import("@google-cloud/secret-manager/build/protos/protos").google.cloud.secretmanager.v1.ISecret; version: import("@google-cloud/secret-manager/build/protos/protos").google.cloud.secretmanager.v1.ISecretVersion; }&gt;

