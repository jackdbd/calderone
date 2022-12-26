import { Firestore } from '@google-cloud/firestore'
import { ExecutionsClient } from '@google-cloud/workflows'
import { GoogleAuth } from 'google-auth-library'
import { makeLog } from '@jackdbd/tags-logger'
import { APP_ID } from './constants.js'

const log = makeLog({
  // structured logging (JSON) in production, unstructured logging in development.
  // https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
  namespace: process.env.K_SERVICE ? undefined : `${APP_ID}:clients`
})

interface Config {
  projectId: string
}

/**
 * Initialized GCP client libraries.
 *
 * In development I set the environment variable GOOGLE_APPLICATION_CREDENTIALS.
 * In production it's not needed: all GCP clients will be instantiated with
 * Application Default Credentials (ADC)
 */
export const clients = ({ projectId }: Config) => {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    log({
      message: `GCP client libraries initialized with Google Application Credentials ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
      tags: ['debug', 'client', 'google_auth', 'firestore', 'workflows']
    })

    // When running locally, we need to specify the OAuth 2.0 scopes.
    // When running on GCP, it doesn't seem necessary.
    // https://developers.google.com/identity/protocols/oauth2/scopes
    const scopes = ['https://www.googleapis.com/auth/cloud-platform']

    return {
      executions: new ExecutionsClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        projectId
      }),
      firestore: new Firestore({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        projectId
      }),
      google_auth: new GoogleAuth({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        projectId,
        scopes
      })
    }
  } else {
    log({
      message:
        'GCP client libraries initialized with Application Default Credentials (ADC)',
      tags: ['debug', 'client', 'google_auth', 'firestore', 'workflows']
    })

    return {
      executions: new ExecutionsClient(),
      firestore: new Firestore(),
      google_auth: new GoogleAuth()
    }
  }
}
