import type { GoogleSpreadsheet } from 'google-spreadsheet'
import { makeHandler } from '../delete-worksheet-rows.js'

export interface Config {
  doc: GoogleSpreadsheet
}

export const redditDelete = ({ doc }: Config) => {
  return {
    method: 'DELETE',
    path: '/reddit',
    handler: makeHandler({ doc, title: 'reddit' })
  }
}
