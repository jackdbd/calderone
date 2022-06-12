export type FetchClient<Res> = (url: string) => Promise<Res>
