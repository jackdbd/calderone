declare module '@11ty/eleventy-fetch' {
  export interface FetchOptions {
    headers?: {
      [string]: string
    }
  }

  export interface Options {
    directory?: string
    duration?: string
    fetchOptions?: FetchOptions
    type?: string
    // type?: 'buffer' | 'json' | 'text'
    verbose?: boolean
  }

  async function EleventyFetch<Res>(url: string, options: Options): Promise<Res>

  export default EleventyFetch
}
