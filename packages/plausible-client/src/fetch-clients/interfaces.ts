export type FetchClient<Response> = (url: string) => Promise<Response>
