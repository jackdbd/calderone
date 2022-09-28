import fs from 'node:fs'
import util from 'node:util'
import makeDebug from 'debug'
import { parse, parseDefaults } from 'himalaya'
// import type { HimalayaJson } from '../../../custom-types/himalaya/index.js'

const debug = makeDebug('csp/html-parser')

const readFileAsync = util.promisify(fs.readFile)

interface HimalayaJson {
  children: any[]
  content: string
  tagName: string
  filter: (predicate: (x: any) => boolean) => any
}

const isHtml = (json: HimalayaJson) => json.tagName === 'html'

const isHead = (json: HimalayaJson) => json.tagName === 'head'

const children = (json: HimalayaJson) => json.children

const isScriptTag = (json: HimalayaJson) => json.tagName === 'script'

const isStyleTag = (json: HimalayaJson) => json.tagName === 'style'

const content = (json: HimalayaJson) => json.content

// for debugging
// const tap = (json: HimalayaJson) => {
//   console.log('=== Himalaya tap ===')
//   console.log(json)
//   return json
// }

const getScriptTagsContents = (json: HimalayaJson): string[] => {
  // .map(tap)
  return json
    .filter(isHtml)
    .flatMap(children)
    .filter(isHead)
    .flatMap(children)
    .filter(isScriptTag)
    .flatMap(children)
    .map(content)
}

const getStyleTagsContents = (json: HimalayaJson): string[] => {
  // .map(tap)
  return json
    .filter(isHtml)
    .flatMap(children)
    .filter(isHead)
    .flatMap(children)
    .filter(isStyleTag)
    .flatMap(children)
    .map(content)
}

/**
 * Parses a HTML file and retrieves the content of all `<script>` tags in `<head>`.
 *
 * filepath is the fullpath to the HTML file to parse.
 *
 * @internal
 */
export const scriptTagsContents = async (filepath: string) => {
  debug(`Look for <script> tags inlined in <head> in ${filepath}`)

  let html: string
  try {
    html = await readFileAsync(filepath, { encoding: 'utf8' })
    // https://github.com/andrejewski/himalaya/blob/master/text/ast-spec-v1.md
    // https://github.com/andrejewski/himalaya/blob/f0b870011b84da362c863dc914157f30d4a603ac/src/index.js#L12
  } catch (err: any) {
    throw new Error(`Could not parse ${filepath}\n${err.message}`)
  }

  const json = parse(html, { ...parseDefaults, includePositions: false })
  return getScriptTagsContents(json)
}

/**
 * Parses a HTML file and retrieves the content of all `<style>` tags in `<head>`.
 *
 * filepath is the fullpath to the HTML file to parse.
 *
 * @internal
 */
export const styleTagsContents = async (filepath: string) => {
  debug(`Look for <style> tags inlined in <head> in ${filepath}`)

  let html: string
  try {
    html = await readFileAsync(filepath, { encoding: 'utf8' })
  } catch (err: any) {
    throw new Error(`Could not parse ${filepath}\n${err.message}`)
  }

  const json = parse(html, { ...parseDefaults, includePositions: false })
  return getStyleTagsContents(json)
}
