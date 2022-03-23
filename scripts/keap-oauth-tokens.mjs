import fs from 'node:fs'
import path from 'node:path'
import { writeFile } from 'fs/promises'
import Nunjucks from 'nunjucks'
import Hapi from '@hapi/hapi'
import Vision from '@hapi/vision'
import { AuthorizationCode } from 'simple-oauth2'
import { monorepoRoot } from './utils.mjs'
import yargs from 'yargs'

const DEFAULT = {
  port: 8090
}

const COOKIE = 'my-session'

const ROUTE = {
  HOME: '/',
  AUTH_CALLBACK: '/auth-callback',
  AUTH_RESPONSE: '/auth-response'
}

const homeGet = ({ authorization_uri }) => {
  return {
    method: 'GET',
    path: ROUTE.HOME,
    handler: async (request, h) => {
      console.log(`GET ${ROUTE.HOME}`)

      const context = {
        h1: 'Authorize OAuth 2.0 application',
        auth_link: {
          href: authorization_uri,
          text: 'Start the OAuth 2.0 Authorization Code Grant flow by visiting this link'
        },
        title: 'Start OAuth 2.0 authorization'
      }

      // https://hapi.dev/tutorials/views?lang=en_US#render
      return h.view('home.njk', context)
    }
  }
}

const authCallbackGet = ({ tokens_filepath, oauth2_client, redirect_uri }) => {
  return {
    method: 'GET',
    path: ROUTE.AUTH_CALLBACK,
    handler: async (request, h) => {
      console.log(`GET ${ROUTE.AUTH_CALLBACK}`)

      // retrieve the code sent by the OAuth 2.0 authorization server
      const { code, scope } = request.query

      console.log(
        `try obtaining access/refresh tokens with scope ${scope} from Keap OAuth 2.0 authorization server`
      )
      try {
        // https://github.com/lelylan/simple-oauth2#access-token
        const { token } = await oauth2_client.getToken({
          code,
          redirect_uri,
          scope
        })

        try {
          await writeFile(tokens_filepath, JSON.stringify(token, null, 2))
          console.log(`Keap OAuth 2.0 tokens persisted in ${tokens_filepath}`)
        } catch (err) {
          console.error(err.message)
        }

        console.log(`set cookie [${COOKIE}]`)
        h.state(COOKIE, {
          access_token: token.access_token,
          refresh_token: token.refresh_token,
          scope: token.scope,
          tokens_filepath
        })

        return h.redirect(ROUTE.AUTH_RESPONSE)
      } catch (err) {
        // console.error(err)
        const reason = err.data.payload.error_description
        // console.log('🚀 err.isBoom', err.isBoom)
        // console.log('🚀 err.output', err.output)
        // console.log('🚀 err.output.payload.message', err.output.payload.message)

        const context = {
          back_to: {
            href: ROUTE.HOME,
            text: `click here to go back to the home page`
          },
          reason,
          title: `Authentication failed (${err.output.payload.message})`
        }
        return h.view('auth-failure.njk', context)
      }
    }
  }
}

const authResponseGet = () => {
  return {
    method: 'GET',
    path: ROUTE.AUTH_RESPONSE,
    handler: async (request, h) => {
      console.log(`GET ${ROUTE.AUTH_RESPONSE}`)

      const cookie = request.state[COOKIE]
      // console.log(`cookie [${COOKIE}]`, cookie)

      if (!cookie) {
        const context = {
          back_to: {
            href: ROUTE.HOME,
            text: `click here to go back to the home page`
          },
          reason: `cookie ${COOKIE} was not set.`,
          title: 'Authentication failed'
        }
        return h.view('auth-failure.njk', context)
      }

      const context = {
        access_token: cookie.access_token,
        refresh_token: cookie.refresh_token,
        scope: cookie.scope,
        tokens_filepath: cookie.tokens_filepath,
        title: 'Authentication successful',
        back_to: {
          href: ROUTE.HOME,
          text: `click here to go back to the home page`
        }
      }

      // immediately clear the cookie from the browser, without waiting the
      // cookie's TTL to expire.
      // Note: the cookie will still be accessible in request.state until we
      // refresh the browser.
      h.unstate(COOKIE)

      return h.view('auth-success.njk', context)
    }
  }
}

const hapiServer = async ({
  client_id,
  client_secret,
  port,
  tokens_filepath
}) => {
  const server = Hapi.server({ port })

  // https://hapi.dev/tutorials/cookies?lang=en_US#server.state

  server.state(COOKIE, {
    // base64json is the default encoding
    encoding: 'base64json',
    // isHttpOnly is set to true by default, to mitigate XSS attacks
    isHttpOnly: true,
    // when isSameSite is set to 'Strict', the cookie is not set. I don't know
    // why. This should be a same-site request and a first-party context, so I
    // would expect SameSite=Strict to work.
    // https://web.dev/samesite-cookies-explained/#samesite-cookie-recipes
    // isSameSite: 'Strict',
    isSameSite: 'Lax',
    // I would have expected that isSecure should be set to false in development,
    // but it seems to work even if isSecure is set to true
    // https://stackoverflow.com/a/49896652/3036129
    isSecure: true,
    // ttl set to null means: clear the cookie as soon as the browser is closed
    ttl: null
    // ttl: 24 * 60 * 60 * 1000 // one day
  })

  // console.log(`HTTP server created at [${server.info.uri}]`)
  console.log(
    `Visit http://localhost:${port} in your browser to proceed with authentication`
  )

  const redirect_uri = `http://localhost:${port}${ROUTE.AUTH_CALLBACK}`

  // OAuth 2.0 Authorization Code Grant flow
  // https://developer.infusionsoft.com/getting-started-oauth-keys/
  // https://github.com/lelylan/simple-oauth2#authorization-code-grant
  const oauth2_client = new AuthorizationCode({
    client: {
      id: client_id,
      secret: client_secret
    },
    auth: {
      tokenHost: 'https://api.infusionsoft.com',
      tokenPath: '/token',
      authorizePath: 'https://accounts.infusionsoft.com/app/oauth/authorize'
    }
  })

  const authorization_uri = oauth2_client.authorizeURL({
    redirect_uri,
    scope: 'full'
  })

  server.route(homeGet({ authorization_uri }))

  server.route(
    authCallbackGet({
      tokens_filepath,
      oauth2_client,
      redirect_uri
    })
  )

  server.route(authResponseGet())

  await server.register(Vision)

  // https://codesandbox.io/s/hapi-v18-nunjucks-m63qp
  server.views({
    engines: {
      njk: {
        compile: (src, options) => {
          const template = Nunjucks.compile(src, options.environment)
          return (context) => {
            return template.render(context)
          }
        }
      }
    },
    path: path.join(monorepoRoot(), 'assets', 'oauth2-app', 'views')
  })

  return server
}

const main = async () => {
  const argv = yargs(process.argv.slice(2)).default(DEFAULT).argv

  const oauth_credentials_path = path.join(
    monorepoRoot(),
    'secrets',
    'keap-oauth-client-credentials.json'
  )

  const obj = JSON.parse(fs.readFileSync(oauth_credentials_path).toString())
  const { client_id, client_secret } = obj

  const tokens_filepath = path.join(
    monorepoRoot(),
    'secrets',
    'keap-oauth-tokens.json'
  )

  const server = await hapiServer({
    client_id,
    client_secret,
    port: argv.port,
    tokens_filepath
  })

  await server.start()
}

main()
