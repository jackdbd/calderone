import { promisify } from 'node:util'
import makeDebug from 'debug'
import { google } from 'googleapis'
import { GoogleAuth } from 'google-auth-library'

const debug = makeDebug('scripts/google-sheets')

interface GetParams {
  range: string
  spreadsheetId: string
}

type Cell = number | string

interface AppendParams {
  range: string
  spreadsheetId: string
  valueInputOption: 'USER_ENTERED' | 'RAW'
  resource: { values: Cell[][] }
}

interface CommonResult {
  config: any
  headers: any
  request: {
    responseURL: string
  }
  status: number
  statusText: string
}

interface GetResult extends CommonResult {
  data: {
    majorDimension: string
    range: string
    values: string[][]
  }
}

interface AppendResult extends CommonResult {
  data: {
    spreadsheetId: string
    tableRange: string
    updates: {
      spreadsheetId: string
      updatedRange: string
      updatedRows: number
      updatedColumns: number
      updatedCells: number
    }
  }
}

interface Config {
  // https://developers.google.com/identity/protocols/oauth2/scopes#sheets
  scopes: string[]
  service_account_filepath: string
}

export const makeSheetsClient = ({
  scopes,
  service_account_filepath
}: Config) => {
  const auth = new GoogleAuth({
    keyFilename: service_account_filepath,
    scopes
  })

  debug('make Google Sheets v4 client')
  const sheets = google.sheets({
    version: 'v4',
    auth
  })

  // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get
  const getAsync = promisify(sheets.spreadsheets.values.get.bind(sheets)) as (
    params: GetParams
  ) => Promise<GetResult>

  // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append
  const appendAsync = promisify(
    sheets.spreadsheets.values.append.bind(sheets)
  ) as (params: AppendParams) => Promise<AppendResult>

  return { getAsync, appendAsync }
}
