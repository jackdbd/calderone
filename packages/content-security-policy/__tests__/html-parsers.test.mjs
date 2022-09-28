import fs from 'node:fs'
import path from 'node:path'
import { scriptTagsContents, styleTagsContents } from '../lib/html-parsers.js'

const HTML_DIR = path.resolve('..', '..', 'assets', 'html-pages')
//   const HTML_DIR = path.join('assets', 'html-pages')
const html_filepath = path.join(HTML_DIR, 'index.html')

// the <head> of this HTML page contains 2 <script> tags and 1 <style> tag
const HTML = fs.readFileSync(html_filepath).toString()

describe('scriptTagsContents', () => {
  it('is an array with two elements when HTML page has two <script> tags inlined in <head>', async () => {
    const contents = await scriptTagsContents(html_filepath)

    expect(contents.length).toBe(2)
  })

  it('is a substring of the entire HTML page', async () => {
    const contents = await scriptTagsContents(html_filepath)

    contents.forEach((content) => {
      expect(HTML).toContain(content)
    })
  })
})

describe('styleTagsContents', () => {
  it('is an array with one element when HTML page has one <style> tag inlined in <head>', async () => {
    const contents = await styleTagsContents(html_filepath)

    expect(contents.length).toBe(1)
  })

  it('is a substring of the entire HTML page', async () => {
    const contents = await styleTagsContents(html_filepath)

    contents.forEach((content) => {
      expect(HTML).toContain(content)
    })
  })
})
