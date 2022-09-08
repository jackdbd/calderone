/**
 * A hyperlink in a text message.
 */
export interface Link {
  href: string
  text: string
}

export interface Section {
  title: string
  body: string
  links?: Link[]
}
