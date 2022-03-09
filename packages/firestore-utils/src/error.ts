// TODO: learn more about Firestore errors.
// The only error interface seems to be BulkWriterError
export const errorFromFirestore = (err: any) => {
  const prefix = "[firestore] ";
  return {
    message: `${prefix}${err.message as string}`,
    status_code: 500,
  };
};
