import path from 'node:path'
// import { env } from 'node:process'
import makeDebug from 'debug'
import yargs from 'yargs'
import { monorepoRoot } from '@jackdbd/utils'
import { makeSheetsClient } from './google-sheets'

const debug = makeDebug('scripts/prova-sheets')

const DEFAULT = {
  range: 'twitter!A1:C1',
  'spreadsheet-id': '1_px1dEv87iuDTTG6f6QfeSdNrGUhIsb941KDQwTOGLc'
}

const main = async () => {
  const argv = yargs(process.argv.slice(2)).default(DEFAULT).argv

  const service_account_filepath = path.join(
    monorepoRoot(),
    'secrets',
    'sa-sheets-webassembly.json'
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

    debug(
      `read values %O in range ${data.range} of spreadsheet ${spreadsheetId}`,
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

    debug(
      `updated %d cells in range ${data.tableRange} of spreadsheet ${data.spreadsheetId}`,
      data.updates.updatedCells
    )
  } catch (err: any) {
    console.error(err.message)
  }
}

main()
