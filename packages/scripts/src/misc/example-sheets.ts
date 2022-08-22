import path from 'node:path'
import yargs from 'yargs'
import { monorepoRoot } from '@jackdbd/utils'
import { makeSheetsClient } from './google-sheets'

interface Argv {
  range: string
  'spreadsheet-id': string
  'service-account': string
}

const DEFAULT: Argv = {
  range: 'twitter!A1:C1',
  'spreadsheet-id': '1_px1dEv87iuDTTG6f6QfeSdNrGUhIsb941KDQwTOGLc',
  'service-account': 'sa-wasm-news.json'
}

const main = async () => {
  const argv = yargs(process.argv.slice(2)).default(DEFAULT).argv as Argv

  const service_account_filepath = path.join(
    monorepoRoot(),
    'secrets',
    argv['service-account']
  )

  // https://developers.google.com/identity/protocols/oauth2/scopes#sheets
  const scopes = ['https://www.googleapis.com/auth/spreadsheets']

  const { getAsync, appendAsync } = makeSheetsClient({
    scopes,
    service_account_filepath
  })

  const spreadsheetId = argv['spreadsheet-id']
  const range = argv.range

  try {
    const { data } = await getAsync({ spreadsheetId, range })

    console.log(
      `read values in range ${data.range} of spreadsheet ${spreadsheetId}`,
      data.values
    )
  } catch (err: any) {
    console.error(err.message)
  }

  try {
    const values = [[1, 2, 3]]
    const resource = {
      values
    }
    const { data } = await appendAsync({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource
    })

    console.log(
      `updated ${data.updates.updatedCells} cells in range ${data.tableRange} of spreadsheet ${data.spreadsheetId}`
    )
  } catch (err: any) {
    console.error(err.message)
  }
}

main()
