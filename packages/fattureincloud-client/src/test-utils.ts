import { env } from 'node:process'
import { Polly, PollyConfig, RecordingEventListener } from '@pollyjs/core'

const mode = env.POLLY_MODE === 'record' ? 'record' : 'replay'
console.log(`POLLY_MODE set to ${mode}`)

/**
 * Strip from the HTTP response api_key and api_uid, so the HAR file can be
 * persisted without any safety concerns.
 * Adapted from this article:
 * https://marmelab.com/blog/2020/01/23/mocking-an-api-with-pollyjs.html
 */
const onBeforePersist: RecordingEventListener = (_req, recording) => {
  const { api_key, api_uid, ...rest } = JSON.parse(
    recording.request.postData.text
  )
  const postData = {
    ...recording.request.postData,
    text: JSON.stringify(rest)
  }
  recording.request.postData = postData
}

// https://netflix.github.io/pollyjs/#/configuration?id=defaults
const config: PollyConfig = {
  adapters: ['node-http'],
  expiresIn: '30d5h10m', // expires in 30 days, 5 hours, and 10 minutes
  mode,
  persister: 'fs',
  persisterOptions: {
    fs: {
      // Polly recordings (HAR files) can be safely stored on the filesystem
      // because we strip sensitive data (api_key, api_uid) in the beforePersist
      // event listener.
      recordingsDir: '__recordings__'
    }
  }
}

export const pollyInstance = (recording_name: string) => {
  const polly = new Polly(recording_name, config)

  // Polly server's handler contains an EventEmitter that emits these events:
  // https://github.com/Netflix/pollyjs/blob/cbca602a5a446da46a4a2834f893670b8c577880/packages/%40pollyjs/core/src/server/handler.js#L19
  polly.server.any().on('beforePersist', onBeforePersist)
  // console.log('polly.config', polly.config)

  return polly
}
