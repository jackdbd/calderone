import type Hapi from '@hapi/hapi'

export const homeGet = (): Hapi.ServerRoute => {
  const config = { method: 'GET', path: '/' }

  return {
    method: config.method,
    options: { auth: false },
    path: config.path,
    handler: async (_request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
      return { message: 'hello' }
    }
  }
}
