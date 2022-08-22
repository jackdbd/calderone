import {
  GoogleSpreadsheet,
  ServiceAccountCredentials
} from 'google-spreadsheet'

interface Config {
  credentials: ServiceAccountCredentials
  sheet_id: string
}

export const googleSheets = async ({ credentials, sheet_id }: Config) => {
  const doc = new GoogleSpreadsheet(sheet_id)
  await doc.useServiceAccountAuth(credentials)
  await doc.loadInfo()

  return doc
}
