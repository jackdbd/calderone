<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/firestore-utils](./firestore-utils.md) &gt; [moveData](./firestore-utils.movedata.md)

## moveData variable

Move Firestore document \*\*data\*\* from the Firestore document id `from`<!-- -->, to the Firestore document id `to`<!-- -->. In other words, the Firestore document ids do \*\*not\*\* change; it's the document data which is moved from a Firestore document to another.

<b>Signature:</b>

```typescript
moveData: <D>({ ref, document_ids }: Config) => Promise<void>
```
