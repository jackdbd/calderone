## API Report File for "@jackdbd/firestore-utils"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { CollectionReference } from '@google-cloud/firestore';
import type { Query } from '@google-cloud/firestore';

// @public
export const bulkCopy: ({ copied_by, dest_collection, query }: BulkCopyConfig) => Promise<{
    doc_ids: {
        copied: string[];
        skipped: string[];
    };
    message: string;
}>;

// @public (undocumented)
export interface BulkCopyConfig {
    // (undocumented)
    copied_by?: string;
    // (undocumented)
    dest_collection: string;
    // (undocumented)
    query: Query;
}

// @public
export const bulkDelete: ({ query }: BulkDeleteConfig) => Promise<{
    doc_ids: {
        deleted: string[];
        skipped: string[];
    };
    message: string;
}>;

// @public (undocumented)
export interface BulkDeleteConfig {
    // (undocumented)
    query: Query;
}

// @public
export const bulkMove: ({ dest_collection, moved_by, query }: BulkMoveConfig) => Promise<{
    doc_ids: {
        moved: {
            src: string;
            dest: string;
        }[];
        skipped: string[];
    };
    message: string;
}>;

// @public (undocumented)
export interface BulkMoveConfig {
    // (undocumented)
    dest_collection: string;
    // (undocumented)
    moved_by?: string;
    // (undocumented)
    query: Query;
}

// @public
export const deleteAllDocsInCollection: (ref: CollectionReference) => Promise<string>;

// @public @deprecated
export const deleteDocsMatchingQuery: (query: Query) => Promise<string>;

// @public (undocumented)
export interface DocResultData<D> {
    // (undocumented)
    data: D;
    // (undocumented)
    doc_id: string;
}

// @public (undocumented)
export interface DocResultId {
    // (undocumented)
    doc_id: string;
    // (undocumented)
    id: string;
}

// @public (undocumented)
export interface DocResultsQueryConfig {
    // (undocumented)
    limit: number;
    // (undocumented)
    query: Query;
}

// @public (undocumented)
export interface DocResultsRefConfig {
    // (undocumented)
    limit: number;
    // (undocumented)
    ref: CollectionReference;
}

// @public
export const docResultsWithData: <D>({ limit, query }: DocResultsQueryConfig) => Promise<DocResultData<D>[]>;

// @public
export const docResultsWithId: ({ limit, ref }: DocResultsRefConfig) => Promise<DocResultId[]>;

// @alpha
export const errorFromFirestore: (err: any) => {
    message: string;
    status_code: number;
};

// @public
export const moveData: <D>({ ref, document_ids }: MoveDataConfig) => Promise<void>;

// @public (undocumented)
export interface MoveDataConfig {
    // (undocumented)
    document_ids: {
        from: string;
        to: string;
    }[];
    // (undocumented)
    ref: CollectionReference;
}

// @public
export const shuffleWithFisherYates: (ref: CollectionReference) => Promise<void>;

```