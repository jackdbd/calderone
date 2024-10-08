<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/firestore-utils](./firestore-utils.md) &gt; [bulkDelete](./firestore-utils.bulkdelete.md)

## bulkDelete() function

Deletes all Firestore documents matching the provided `query`<!-- -->.

This is a Firestore transaction. Either all documents are deleted, or none is.

**Signature:**

```typescript
bulkDelete: ({ query }: BulkDeleteConfig) => Promise<{
    doc_ids: {
        deleted: string[];
        skipped: string[];
    };
    message: string;
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

{ query }


</td><td>

[BulkDeleteConfig](./firestore-utils.bulkdeleteconfig.md)


</td><td>


</td></tr>
</tbody></table>
**Returns:**

Promise&lt;{ doc\_ids: { deleted: string\[\]; skipped: string\[\]; }; message: string; }&gt;

