import type { GoogleSpreadsheet } from 'google-spreadsheet'
import { makeHandler } from '../delete-worksheet-rows.js'

export interface Config {
  doc: GoogleSpreadsheet
}

export const twitterDelete = ({ doc }: Config) => {
  return {
    method: 'DELETE',
    path: '/twitter',
    handler: makeHandler({ doc, title: 'twitter' })
  }
}
