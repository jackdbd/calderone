import { MAX_CHARS } from './constants.js'
import type { Link, Section } from './interfaces.js'
import { anchor } from './utils.js'

export interface Config {
  title: string
  subtitle?: string
  description: string
  sections?: Section[]
  links?: Link[]
}

export interface Options {
  is_title_bold?: boolean
  is_subtitle_italic?: boolean
  is_section_title_bold?: boolean
}

export const DEFAULT_OPTIONS: Required<Options> = {
  is_title_bold: true,
  is_subtitle_italic: true,
  is_section_title_bold: true
}

/**
 * Generic text message.
 */
export const genericText = (
  config: Config,
  options: Options = DEFAULT_OPTIONS
) => {
  const { description, links, sections, subtitle, title } = config

  const is_subtitle_italic =
    options.is_subtitle_italic !== undefined
      ? options.is_subtitle_italic
      : DEFAULT_OPTIONS.is_subtitle_italic

  const is_title_bold =
    options.is_title_bold !== undefined
      ? options.is_title_bold
      : DEFAULT_OPTIONS.is_title_bold

  let s = is_title_bold ? `<b>${title}</b>` : title

  if (subtitle) {
    s = is_subtitle_italic ? `${s}\n<i>${subtitle}</i>` : `${s}\n${subtitle}`
  }

  s = `${s}\n\n${description}`

  if (sections && sections.length > 0) {
    const is_section_title_bold =
      options.is_section_title_bold !== undefined
        ? options.is_section_title_bold
        : DEFAULT_OPTIONS.is_section_title_bold

    const s_sections = sections
      .map((d) => {
        let s_section = is_section_title_bold
          ? `<b>${d.title}</b>\n${d.body}`
          : `${d.title}\n${d.body}`

        if (d.links && d.links.length > 0) {
          const s_links = d.links.map(anchor).join('\n')
          s_section = `${s_section}\n\n${s_links}`
        }

        return s_section
      })
      .join('\n\n')

    s = `${s}\n\n${s_sections}`
  }

  if (links && links.length > 0) {
    const s_links = links.map(anchor).join('\n')
    s = `${s}\n\n${s_links}`
  }

  // When the string is longer than MAX_CHARS we have 2 options:
  // 1. return s.slice(0, MAX_CHARS)
  // 2. throw an error
  //
  // Returning s.slice(0, MAX_CHARS) would be too risky, because the call to the
  // Telegram sendMessage API endpoint might fail because we might cut away a
  // closing tag from the text message. This occurred to me several times, and
  // the error message from Telegram is not immediately clear.
  // It's much better to fail now, with a clear error message, that trying our
  // luck with a call to the sendMessage API that might fail because of some
  // missing tag.
  if (s.length > MAX_CHARS) {
    throw new Error(
      `Text message is too long (${s.length} chars). Telegram sendMessage API endpoint accepts a max of ${MAX_CHARS} chars.`
    )
  }

  return s
}
