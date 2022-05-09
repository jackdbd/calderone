import { env } from 'node:process'
import { PubSub, Subscription } from '@google-cloud/pubsub'
import makeDebug from 'debug'
import yargs from 'yargs'

const debug = makeDebug('scripts/pubsub/publish-message')

const DEFAULT = {
  'project-id': env.GCP_PROJECT_ID,
  'topic-name': 'some-topic',
  'subscription-name': 'some-subscription'
}

const main = async () => {
  const argv = yargs(process.argv.slice(2)).default(DEFAULT).argv

  const pubsub = new PubSub({
    projectId: argv['project-id']
  })
  debug(`Cloud Pub/Sub client created`)

  const topic_name = argv['topic-name']
  const topic = pubsub.topic(topic_name)

  const subscription_name = argv['subscription-name']

  // https://console.cloud.google.com/cloudpubsub/subscription/list?project=prj-kitchen-sink
  let subscription: Subscription
  try {
    subscription = topic.subscription(subscription_name)
  } catch (err: any) {
    console.error(`=== ERROR === ${err.message}`)
    process.exitCode = 1
    return
  }

  subscription.on('message', (message: any) => {
    console.log('Received message:', message.data.toString())
    // process.exit(0)
    return
  })

  subscription.on('error', (err: any) => {
    console.log('Received error:', err)
    process.exit(1)
  })

  const id_1 = await topic.publishMessage({
    data: Buffer.from('Test message 1!')
  })
  debug(`message published with id ${id_1}`)

  const id_2 = await topic.publishMessage({
    data: Buffer.from('Test message 2!')
  })
  debug(`message published with id ${id_2}`)
}

main()
