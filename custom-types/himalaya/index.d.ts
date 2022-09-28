declare module 'himalaya' {
  export interface HimalayaJson {
    children: any
    content: string
    tagName: string
    filter: (predicate: (x: any) => boolean) => any
  }

  export interface Options {
    includePositions: boolean
  }

  export function parse(html: string, options: Options): HimalayaJson

  export const parseDefaults: Options
}
