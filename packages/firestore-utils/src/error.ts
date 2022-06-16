/**
 * Converts a Firestore error into an error with a `message` and a `status_code`.
 *
 * @privateRemarks
 * Learn more about Firestore errors.
 * The only error interface seems to be BulkWriterError
 *
 * @alpha
 */
export const errorFromFirestore = (err: any) => {
  const prefix = '[firestore] '
  return {
    message: `${prefix}${err.message as string}`,
    status_code: 500
  }
}
