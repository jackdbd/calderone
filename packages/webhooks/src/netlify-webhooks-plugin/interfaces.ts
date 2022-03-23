export type Unit = 'bytes' | 'requests' | 'seconds' | 'submissions'

// find a better name
interface BillingDatum {
  included: number
  unit: Unit
  used: number
}

export interface SiteCapabilities {
  asset_acceleration: boolean
  branch_deploy: boolean
  build_node_pool: string
  cdn_propagation: 'partial' // others?
  cdn_tier: 'reg'
  domain_aliases: boolean
  form_processing: boolean
  forms: {
    storage: BillingDatum
    submissions: BillingDatum
  }
  functions: {
    invocations: BillingDatum
    runtime: BillingDatum
  }
  geo_ip: boolean
  id: string
  ipv6_domain: string
  managed_dns: boolean
  prerendering: boolean
  proxying: boolean
  rate_cents: number
  secure_site: boolean
  split_testing: boolean
  ssl: 'custom' // others?
  title: string
  yearly_rate_cents: number
}

export interface NetlifyDeployStartedEvent {
  admin_url: string
  available_functions: number[]
  branch: string
  build_id: string
  commit_ref: string
  commit_url: string
  committer: string
  context: 'production' // others?
  created_at: string
  deploy_ssl_url: string
  deploy_time: null
  deploy_url: string
  entry_path: null
  error_message: null
  file_tracking_optimization: boolean
  framework: null
  function_schedules: null
  has_edge_handlers: boolean
  id: string
  links: {
    alias: string
    branch: null
    permalink: string
  }
  locked: null
  log_access_attributes: {
    endpoint: string
    path: string
    token: string
    type: string
    url: string
  }
  manual_deploy: boolean
  name: string
  plugin_state: string
  published_at: null
  required: number[]
  required_functions: null
  review_id: null
  review_url: null
  screenshot_url: null
  site_capabilities: SiteCapabilities
  site_id: string
  skipped: null
  skipped_log: null
  ssl_url: string
  state: 'building' // others?
  title: string
  updated_at: string
  url: string
  user_id: string
  views_count: null
}

interface OrderedHumanField {
  [key: number]: {
    name: string
    title: string
    value: string
  }
}

export interface NetlifyFormSubmissionEvent {
  body: string
  company: null
  created_at: string
  data: {
    email: string
    ip: string
    message: string
    name: string
    referrer: string
    user_agent: string
  }
  email: string
  first_name: string
  form_id: string
  form_name: string
  human_fields: {
    [key: string]: string
  }
  id: string
  last_name: string
  name: string
  number: number
  ordered_human_fields: OrderedHumanField[]
  site_url: string
  summary: string
  title: null
}

export interface FormSubmissionSummary {
  created_at: string
  email: string
  form_id: string
  form_name: string
  ip: string
  message: string
  name: string
  remaining_submissions: number
  site_url: string
  user_agent: string
}

export type RequestPayload =
  | NetlifyDeployStartedEvent
  | NetlifyFormSubmissionEvent
