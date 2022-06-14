// https://plausible.io/docs/stats-api#get-apiv1statsaggregate
export interface AggregateOptions {
  compare?: string
  filters?: string
  metrics?: string
  period?: string
}

export interface AggregateResponse {
  results: {
    bounce_rate: { value: number }
    pageviews: { value: number }
    visit_duration: { value: number }
    visitors: { value: number }
  }
}

// https://plausible.io/docs/stats-api#get-apiv1statsbreakdown
export interface BreakdownOptions {
  filters?: string
  limit?: number
  metrics?: string
  page?: number
  period?: string
  property?: string
}

export interface BreakdownResult {
  bounce_rate: number
  page: string
  source: string
  visitors: number
}

export interface BreakdownResponse {
  results: BreakdownResult[]
}

// https://plausible.io/docs/stats-api#get-apiv1statstimeseries
export interface TimeseriesOptions {
  filters?: string
  interval?: string
  metrics?: string
  period?: string
}

export interface TimeseriesResult {
  date: string
  visitors: number
}

export interface TimeseriesResponse {
  results: TimeseriesResult[]
}
