import type { Link } from './interfaces.js'

/**
 * Converts a link into an anchor tag.
 */
export const anchor = (link: Link) => `<a href="${link.href}">${link.text}</a>`
