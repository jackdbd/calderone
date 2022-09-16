/**
 * Credentials of a FattureinCloud account.
 */
export interface Credentials {
  api_key: string
  api_uid: string
}

export interface APIResponseBodyError {
  error?: string
  error_code?: number
}

export type PromiseReturningFn<T = any> = (...args: any) => Promise<T>

export type AsyncGenReturningFn = (
  ...args: any
) => AsyncGenerator<any, void, unknown>

export interface BasicClient {
  [fn_name: string]: PromiseReturningFn | AsyncGenReturningFn
}
