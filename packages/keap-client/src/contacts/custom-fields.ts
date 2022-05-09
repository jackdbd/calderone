import type { CustomField } from './interfaces.js'

type FieldValue = string | null

type CustomFieldsMap = { [field_name: string]: FieldValue }

export const customFieldsReducer = (
  acc: CustomFieldsMap,
  _field: CustomField
) => {
  //   const num = field.id
  //   return { ...acc, your_custom_field: field.content }
  return acc
}

export const customFieldContent = (fields: CustomField[], id: number) => {
  const arr = fields.filter((field) => field.id === id)
  const content = arr.length === 1 ? (arr[0].content as string) : undefined
  return content
}
