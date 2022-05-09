import type { Fault } from '../error.js'

export interface ErrorWithFault {
  fault: Fault
}

export interface ErrorWithDescription {
  error: string
  error_description: string
}

export interface Tokens {
  access_token: string
  expires_at?: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: 'bearer'
}

export type ResponseBody = ErrorWithDescription | ErrorWithFault | Tokens
