// import fs from 'node:fs'
// import path from 'node:path'
import { env } from 'node:process'
import { PubSub, Topic } from '@google-cloud/pubsub'
// import { monorepoRoot } from '@jackdbd/utils/path'
import makeDebug from 'debug'
import yargs from 'yargs'

const debug = makeDebug('scripts/pubsub/create-topic')

const DEFAULT = {
  'create-dead-letter-topic': true,
  'project-id': env.GCP_PROJECT_ID,
  'topic-name': 'some-topic'
}

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .boolean(['create-dead-letter-topic'])
    .default(DEFAULT).argv

  // const json_key_path = path.join(monorepoRoot(), 'secrets', 'sa-notifier.json')
  // const obj = JSON.parse(fs.readFileSync(json_key_path).toString())
  // const { project_id, client_email, private_key } = obj

  const pubsub = new PubSub({
    projectId: argv['project-id']
    // credentials: { client_email, private_key }
  })
  debug(`Cloud Pub/Sub client created`)

  const topic_name = argv['topic-name']

  let topic: Topic
  try {
    const topic_response = await pubsub.createTopic({
      name: topic_name,
      labels: { customer: 'personal', environment: 'test' }
    })
    topic = topic_response[0]
    debug(`created topic ${topic.name}`)
  } catch (err: any) {
    console.error(`=== ERROR === ${err.message}`)
    process.exitCode = 1
    return
  }

  if (argv['create-dead-letter-topic']) {
    let topic: Topic
    try {
      const topic_response = await pubsub.createTopic({
        name: `${topic_name}_dead`,
        labels: { customer: 'personal', environment: 'test' }
      })
      topic = topic_response[0]
      debug(`created dead letter topic (aka dead letter queue) ${topic.name}`)
    } catch (err: any) {
      console.error(`=== ERROR === ${err.message}`)
      process.exitCode = 1
      return
    }
  }
}

main()
