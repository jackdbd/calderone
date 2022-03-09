export {
  deleteAllDocsInCollection,
  deleteDocsMatchingQuery,
} from "./delete.js";

export { errorFromFirestore } from "./error.js";

export { moveData, shuffleWithFisherYates } from "./move.js";

export { docResultsWithId, docResultsWithData } from "./retrieve.js";
export type {
  DocResultData,
  DocResultsRefConfig,
  DocResultId,
  DocResultsQueryConfig,
} from "./retrieve.js";
