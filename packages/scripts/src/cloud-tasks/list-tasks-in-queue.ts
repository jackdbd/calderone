import fs from 'node:fs'
import path from 'node:path'
import yargs from 'yargs'
import { CloudTasksClient } from '@google-cloud/tasks'
import { monorepoRoot } from '@jackdbd/utils/path'

interface Argv {
  'service-account': string
  'location-id': string
  'queue-id': string
}

const DEFAULT: Argv = {
  'service-account': 'sa-notifier.json',
  'location-id': 'europe-west3',
  'queue-id': 'my-queue'
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

  const tasks = new CloudTasksClient({
    projectId: project_id,
    credentials: { client_email, private_key }
  })

  const queues_parent = tasks.locationPath(project_id, argv['location-id'])
  const tasks_parent = `${queues_parent}/queues/${argv['queue-id']}`

  try {
    const [tasks_in_queue] = await tasks.listTasks({ parent: tasks_parent })
    const names = tasks_in_queue.map((t) => t.name)
    console.log(
      `${tasks_in_queue.length} tasks in queue ${argv['queue-id']}`,
      names
    )
  } catch (err: any) {
    console.log(
      `could not list tasks in queue ${argv['queue-id']}: ${err.message}`
    )
  }
}

main()
