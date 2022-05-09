import Boom from '@hapi/boom'
import type Hapi from '@hapi/hapi'
import type { GoogleSpreadsheet } from 'google-spreadsheet'

export interface Config {
  doc: GoogleSpreadsheet
  title: string
}

export const makeHandler = ({ doc, title }: Config) => {
  const sheet = doc.sheetsByTitle[title]
  //
  return async function handler(
    request: Hapi.Request,
    _h: Hapi.ResponseToolkit
  ) {
    try {
      // getRows() automatically skips the worksheet header row
      const rows = await sheet.getRows()

      const promises = rows.map(async (row) => {
        try {
          await row.delete()
          const message = `deleted row ${row.a1Range}`
          request.log([title, 'debug'], { message })
        } catch (err: any) {
          const message = `could not delete row ${row.a1Range}`
          request.log([title, 'warning'], { message })
        }
      })

      await Promise.all(promises)
    } catch (err: any) {
      throw Boom.internal()
    }

    return {
      message: `deleted all rows in spreadsheet ${doc.title}, worksheet ${sheet.title}`
    }
  }
}
