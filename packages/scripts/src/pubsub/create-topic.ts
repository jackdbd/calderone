import fs from 'node:fs'
import path from 'node:path'
import { PubSub, Topic } from '@google-cloud/pubsub'
import { monorepoRoot } from '@jackdbd/utils/path'
import yargs from 'yargs'

interface Argv {
  'add-dead-letter-topic': boolean
  'topic-name': string
  'service-account': string
}

const DEFAULT: Argv = {
  'add-dead-letter-topic': false,
  'topic-name': 'some-topic',
  'service-account': 'sa-pubsub.json'
}

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .boolean(['add-dead-letter-topic'])
    .default(DEFAULT).argv as Argv

  const json_key_path = path.join(
    monorepoRoot(),
    'secrets',
    argv['service-account']
  )
  const { project_id, client_email, private_key } = JSON.parse(
    fs.readFileSync(json_key_path).toString()
  )

  const pubsub = new PubSub({
    projectId: project_id,
    credentials: { client_email, private_key }
  })

  const topic_name = argv['topic-name']

  let topic: Topic
  try {
    const topic_response = await pubsub.createTopic({
      name: topic_name,
      labels: { customer: 'personal', environment: 'test' }
    })
    topic = topic_response[0]
    console.log(`created topic ${topic.name}`)
  } catch (err: any) {
    console.error(`=== ERROR === ${err.message}`, err)
    process.exitCode = 1
    return
  }

  if (argv['add-dead-letter-topic']) {
    let topic: Topic
    try {
      const topic_response = await pubsub.createTopic({
        name: `${topic_name}_dead`,
        labels: { customer: 'personal', environment: 'test' }
      })
      topic = topic_response[0]
      console.log(
        `created dead letter topic (aka dead letter queue) ${topic.name}`
      )
    } catch (err: any) {
      console.error(`=== ERROR === ${err.message}`)
      process.exitCode = 1
      return
    }
  }
}

main()
