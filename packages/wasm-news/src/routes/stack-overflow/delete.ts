import type { GoogleSpreadsheet } from 'google-spreadsheet'
import { makeHandler } from '../delete-worksheet-rows.js'

export interface Config {
  doc: GoogleSpreadsheet
}

export const stackOverflowDelete = ({ doc }: Config) => {
  return {
    method: 'DELETE',
    path: '/stack-overflow',
    handler: makeHandler({ doc, title: 'stack_overflow' })
  }
}
