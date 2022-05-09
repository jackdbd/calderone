import type { GoogleSpreadsheet } from 'google-spreadsheet'
import { makeHandler } from '../delete-worksheet-rows.js'

export interface Config {
  doc: GoogleSpreadsheet
}

export const githubDelete = ({ doc }: Config) => {
  const handler = makeHandler({ doc, title: 'github' })
  return {
    method: 'DELETE',
    path: '/github',
    handler
  }
}
