import fs from 'node:fs'
import path from 'node:path'
import { env } from 'node:process'
import makeDebug from 'debug'
import yargs from 'yargs'
import { CloudTasksClient } from '@google-cloud/tasks'
import { monorepoRoot } from '@jackdbd/utils/path'
import { nowAndFutureUTC } from '@jackdbd/utils/dates'

const debug = makeDebug('scripts/cloud-scheduler/example')

const DEFAULT = {
  'delete-queue': false,
  'purge-queue': false
}

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .boolean(['delete-queue', 'purge-queue'])
    .default(DEFAULT).argv

  const json_key_path = path.join(monorepoRoot(), 'secrets', 'sa-notifier.json')

  const obj = JSON.parse(fs.readFileSync(json_key_path).toString())
  const { project_id, client_email, private_key } = obj

  const tasks = new CloudTasksClient({
    projectId: project_id,
    credentials: { client_email, private_key }
  })

  const location_id = 'europe-west3'
  const queue_id = 'my-queue'
  const task_id = `my-task-${new Date().getTime()}`

  const queues_parent = tasks.locationPath(project_id, location_id)
  const tasks_parent = `${queues_parent}/queues/${queue_id}`

  const req_body = {
    text: 'Hello from a Cloud Tasks example script'
  }
  const body = Buffer.from(JSON.stringify(req_body)).toString('base64')

  // schedule a task for tomorrow
  const { future } = nowAndFutureUTC(1)
  const ts_seconds = new Date(future).getTime() / 1000.0

  try {
    const [queues] = await tasks.listQueues({ parent: queues_parent })
    debug(`${queues.length} queues in project id ${project_id} %O`, queues)
  } catch (err: any) {
    debug(`could not create queue: ${err.message}`)
  }

  try {
    const [task] = await tasks.createTask({
      parent: tasks_parent,
      task: {
        name: `${tasks_parent}/tasks/${task_id}`,
        scheduleTime: { seconds: ts_seconds },
        httpRequest: {
          body,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          httpMethod: 'POST',
          oidcToken: { serviceAccountEmail: client_email },
          url: env.SEND_TELEGRAM_MESSAGE_TRIGGER_URL
        }
      }
    })
    debug(`created task [${task.name}]`)
  } catch (err: any) {
    debug(`could not create task: ${err.message}`)
  }

  try {
    const [tasks_in_queue] = await tasks.listTasks({ parent: tasks_parent })
    const names = tasks_in_queue.map((t) => t.name)
    debug(`${tasks_in_queue.length} tasks in queue ${queue_id} %O`, names)
  } catch (err: any) {
    debug(`could not list tasks in queue ${queue_id}: ${err.message}`)
  }

  if (argv['purge-queue']) {
    try {
      await tasks.purgeQueue({ name: queue_id })
    } catch (err: any) {
      debug(`could not purge queue: ${err.message}`)
    }
  }

  if (argv['delete-queue']) {
    try {
      await tasks.deleteQueue({ name: queue_id })
    } catch (err: any) {
      debug(`could not delete queue: ${err.message}`)
    }
  }
}

main()
