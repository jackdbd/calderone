import fs from 'node:fs'
import path from 'node:path'
import { PubSub, Subscription } from '@google-cloud/pubsub'
import { monorepoRoot } from '@jackdbd/utils/path'
import yargs from 'yargs'

interface Argv {
  'topic-name': string
  'subscription-name': string
  'service-account': string
}

const DEFAULT: Argv = {
  'topic-name': 'some-topic',
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

  const subscription_name = argv['subscription-name']

  // https://console.cloud.google.com/cloudpubsub/subscription/list?project=prj-kitchen-sink
  let subscription: Subscription
  try {
    subscription = topic.subscription(subscription_name)
  } catch (err: any) {
    console.error(`=== ERROR === ${err.message}`, err)
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
  console.log(`message published with id ${id_1}`)

  const id_2 = await topic.publishMessage({
    data: Buffer.from('Test message 2!')
  })
  console.log(`message published with id ${id_2}`)

  const ms = 10000
  console.log(`subscription ${subscription.name} will be closed in ${ms} ms`)

  const timeout_id = setTimeout(async () => {
    await subscription.close()
    console.log(`closed subscription ${subscription.name}`)
    clearTimeout(timeout_id)
  }, ms)
}

main()
