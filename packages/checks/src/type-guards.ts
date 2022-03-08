export const isError = (value: Error | any): value is Error => {
  // when does err.stack is not defined?
  return (
    (value as Error).name !== undefined &&
    (value as Error).message !== undefined
    // (value as Error).stack !== undefined
  )
}

export const isString = (value: string | any): value is string => {
  return (value as string).length !== undefined
}

export const isTimeout = (value: any): value is NodeJS.Timeout => {
  return (
    (value as NodeJS.Timeout).refresh !== undefined &&
    (value as NodeJS.Timeout).ref !== undefined &&
    (value as NodeJS.Timeout).unref !== undefined
  )
}
