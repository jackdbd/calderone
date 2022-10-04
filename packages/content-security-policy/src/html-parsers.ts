import fs from 'node:fs'
import util from 'node:util'
import makeDebug from 'debug'
import { parse, parseDefaults } from 'himalaya'
// import type { HimalayaJson } from '../../../custom-types/himalaya/index.js'

const debug = makeDebug('csp/html-parsers')

const readFileAsync = util.promisify(fs.readFile)

type NodeType = 'element' | 'comment' | 'text'

interface Node {
  type: NodeType
}

interface Attribute {
  key: string
  value?: string
}

export interface Element extends Node {
  type: 'element'
  tagName: string
  children: Node[] | Element[]
  attributes: Attribute[]
}

// https://github.com/andrejewski/himalaya/blob/master/text/ast-spec-v1.md
interface HimalayaJson {
  children: any[]
  content: string
  tagName: string
  filter: (predicate: (x: any) => boolean) => any
}

const isHtml = (json: HimalayaJson) => json.tagName === 'html'

const isHead = (json: HimalayaJson) => json.tagName === 'head'

const isBody = (json: HimalayaJson) => json.tagName === 'body'

const children = (json: HimalayaJson) => json.children

const isScriptTag = (json: HimalayaJson) => json.tagName === 'script'

const isStyleTag = (json: HimalayaJson) => json.tagName === 'style'

const content = (json: HimalayaJson) => json.content

// for debugging
export const tap = (json: HimalayaJson) => {
  console.log('=== Himalaya tap ===')
  console.log(json)
  // console.log(JSON.stringify(json, null, 2))
  return json
}

const propertyValue = (elem: Element, property: string) => {
  return elem.attributes
    .filter((attr) => attr.key.toLowerCase() === property)
    .filter((attr) => attr.value !== undefined)
    .map((attr) => attr.value!)
}

const getScriptTagsContents = (json: HimalayaJson): string[] => {
  return json
    .filter(isHtml)
    .flatMap(children)
    .filter(isHead)
    .flatMap(children)
    .filter(isScriptTag)
    .flatMap(children)
    .map(content)
}

const eventHandlerContents = (json: HimalayaJson) => {
  const contents: string[] = []

  const recur = (node: Node): void => {
    if (node.type !== 'element') {
      return
    }

    const elem = node as Element
    if (elem.children) {
      // TODO: consider other inlined JS snippts (onhover, onmousehover, etc)
      const snippets = propertyValue(elem, 'onclick')
      if (snippets.length > 0) {
        contents.push(...snippets)
      }
      elem.children.forEach((child) => recur(child))
      return
    } else {
      return
    }
  }

  recur(json as any)

  return contents
}

const styleContents = (json: HimalayaJson) => {
  const contents: string[] = []

  const recur = (node: Node): void => {
    if (node.type !== 'element') {
      return
    }

    const elem = node as Element

    if (elem.children) {
      const snippets = propertyValue(elem, 'style')
      if (snippets.length > 0) {
        contents.push(...snippets)
      }
      elem.children.forEach((child) => recur(child))
      return
    } else {
      return
    }
  }

  recur(json as any)

  return contents
}

const getInlineEventHandlerContents = (json: HimalayaJson): string[] => {
  return json
    .filter(isHtml)
    .flatMap(children)
    .filter(isBody)
    .flatMap(children)
    .flatMap(eventHandlerContents)
  // .map(tap)
}

const getInlineStyleContents = (json: HimalayaJson): string[] => {
  return json
    .filter(isHtml)
    .flatMap(children)
    .filter(isBody)
    .flatMap(children)
    .flatMap(styleContents)
  // .map(tap)
}

const getStyleTagsContents = (json: HimalayaJson): string[] => {
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
 *
 * filepath is the fullpath to the HTML file to parse.
 *
 * @internal
 *
 * https://github.com/andrejewski/himalaya/blob/master/text/ast-spec-v1.md
 * https://github.com/andrejewski/himalaya/blob/f0b870011b84da362c863dc914157f30d4a603ac/src/index.js#L12
 */
const himalayaJson = async (filepath: string) => {
  try {
    const html = await readFileAsync(filepath, { encoding: 'utf8' })
    return parse(html, { ...parseDefaults, includePositions: false })
  } catch (err: any) {
    throw new Error(`Could not parse ${filepath}\n${err.message}`)
  }
}

/**
 * Parses a HTML file and retrieves the content of all `<script>` tags in `<head>`.
 *
 * @internal
 */
export const scriptTagsContents = async (filepath: string) => {
  debug(`Look for <script> tags inlined in <head> in ${filepath}`)
  const json = await himalayaJson(filepath)
  return getScriptTagsContents(json)
}

/**
 * Parses a HTML file and retrieves the content of all `<style>` tags in `<head>`.
 *
 * @internal
 */
export const styleTagsContents = async (filepath: string) => {
  debug(`Look for <style> tags inlined in <head> in ${filepath}`)
  const json = await himalayaJson(filepath)
  return getStyleTagsContents(json)
}

/**
 * Parses a HTML file and retrieves the content of all inline event handlers in `<body>`.
 *
 * @internal
 */
export const inlineEventHandlerContents = async (filepath: string) => {
  debug(`Look for event handlers inlined in <body> in ${filepath}`)
  const json = await himalayaJson(filepath)
  return getInlineEventHandlerContents(json)
}

/**
 * Parses a HTML file and retrieves the content of all inline styles in `<body>`.
 *
 * @internal
 */
export const inlineStyleContents = async (filepath: string) => {
  debug(`Look for inline styles in <body> in ${filepath}`)
  const json = await himalayaJson(filepath)
  return getInlineStyleContents(json)
}
