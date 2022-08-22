import fs from 'node:fs'
import path from 'node:path'
import { PubSub, Subscription } from '@google-cloud/pubsub'
import { monorepoRoot } from '@jackdbd/utils/path'
import yargs from 'yargs'

interface Argv {
  'topic-name': string
  'dead-letter-topic-name': string
  'subscription-name': string
  'service-account': string
}

const DEFAULT: Argv = {
  'topic-name': 'some-topic',
  'dead-letter-topic-name': 'some-topic_dead',
  'subscription-name': 'some-subscription',
  'service-account': 'sa-pubsub.json'
}

const main = async () => {
  const argv = yargs(process.argv.slice(2)).default(DEFAULT).argv as Argv

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
  const topic = pubsub.topic(topic_name)
  const dead_letter_topic_name = argv['dead-letter-topic-name']
  const dead_letter_topic = pubsub.topic(dead_letter_topic_name)

  const options = {
    deadLetterPolicy: {
      deadLetterTopic: dead_letter_topic.name,
      maxDeliveryAttempts: 10
    }
  }

  const subscription_name = argv['subscription-name']

  let subscription: Subscription
  try {
    const sub_res = await topic.createSubscription(subscription_name, options)
    subscription = sub_res[0]
  } catch (err: any) {
    console.error(`=== ERROR === ${err.message}`, err)
    process.exitCode = 1
    return
  }

  console.log(
    `Created subscription ${subscription_name} with dead letter topic ${dead_letter_topic_name}.`
  )
  console.log(
    'To process dead letter messages, remember to add a subscription to your dead letter topic.'
  )
}

main()
