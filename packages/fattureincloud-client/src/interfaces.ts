export interface Credentials {
  api_key: string;
  api_uid: string;
}

export interface APIResponseBodyError {
  error?: string;
  error_code?: number;
}

// export interface ResponseBody {
//   /**
//    * Appropriate status code for the HTTP request. This is necessary because the
//    * FattureInCloud API always returns 200.
//    */
//   status_code: number
// }
