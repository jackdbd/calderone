declare module '@11ty/eleventy-fetch' {
  interface FetchOptions {
    headers?: {
      [string]: string
    }
  }

  interface Options {
    directory?: string
    duration?: string
    fetchOptions?: FetchOptions
    type?: string
    // type?: 'buffer' | 'json' | 'text'
  }

  async function EleventyFetch<Res>(url: string, options: Options): Promise<Res>

  export default EleventyFetch
}
