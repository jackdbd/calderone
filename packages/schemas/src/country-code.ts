import type { JSONSchemaType } from 'ajv'
import { SchemaId } from './constants.js'

export const country_code: JSONSchemaType<string> = {
  $id: SchemaId.CountryCode,
  type: 'string',
  minLength: 2,
  maxLength: 2
}
