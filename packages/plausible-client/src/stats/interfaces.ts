export interface Config {
  apiKey: string
  siteId: string
}

export interface Options {
  cacheDirectory?: string
  cacheDuration?: string
  cacheVerbose?: boolean
  limit?: number
  period?: string
}

export interface StatsAPIResult {
  page: string
  visitors: number
}

export interface StatsAPIResponse {
  results: StatsAPIResult[]
}
