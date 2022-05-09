import { env } from 'node:process'
import { PubSub, Subscription } from '@google-cloud/pubsub'
import makeDebug from 'debug'
import yargs from 'yargs'

const debug = makeDebug('scripts/pubsub/create-subscription')

const DEFAULT = {
  'project-id': env.GCP_PROJECT_ID,
  'topic-name': 'some-topic',
  'dead-letter-topic-name': 'some-topic_dead',
  'subscription-name': 'some-subscription'
}

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .boolean(['delete-queue', 'purge-queue'])
    .default(DEFAULT).argv

  const pubsub = new PubSub({
    projectId: argv['project-id']
  })
  debug(`Cloud Pub/Sub client created`)

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
    console.error(`=== ERROR === ${err.message}`)
    process.exitCode = 1
    return
  }

  debug(
    `Created subscription ${subscription_name} with dead letter topic ${dead_letter_topic_name}.`
  )
  debug(
    'To process dead letter messages, remember to add a subscription to your dead letter topic.'
  )
}

main()
