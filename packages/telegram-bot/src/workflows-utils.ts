import type { ExecutionsClient } from '@google-cloud/workflows'
import { makeLog } from '@jackdbd/tags-logger'
import { APP_ID } from './constants.js'

const log = makeLog({
  // https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
  namespace: process.env.K_SERVICE ? undefined : `${APP_ID}:workflows-utils`
})

interface CreateExecution {
  client: ExecutionsClient
  location: string
  project: string
  workflow: string
}

/**
 * Creates a Workflow execution, waits for the execution to complete, then
 * returns the execution result.
 */
export const createExecutionAndWaitForResult = async ({
  client,
  location,
  project,
  workflow
}: CreateExecution) => {
  try {
    const createExecutionRes = await client.createExecution({
      parent: client.workflowPath(project, location, workflow)
    })

    const executionName = createExecutionRes[0].name

    log({
      message: `created execution ${executionName}`,
      tags: ['info', 'workflows', workflow]
    })

    // Wait for execution to finish, then print results.
    let executionFinished = false
    let backoffDelay = 1000 // Start wait with delay of 1,000 ms

    log({
      message: `poll every 1s for result of execution ${executionName}...`,
      tags: ['debug', 'workflows', workflow]
    })

    while (!executionFinished) {
      const [execution] = await client.getExecution({
        name: executionName
      })
      executionFinished = execution.state !== 'ACTIVE'

      // If we haven't seen the result yet, wait a second.
      if (!executionFinished) {
        log({
          message: `waiting for results of execution ${executionName}...`,
          tags: ['debug', 'workflows', workflow]
        })

        await new Promise((resolve) => {
          setTimeout(resolve, backoffDelay)
        })

        backoffDelay *= 2 // Double the delay to provide exponential backoff.
      } else {
        log({
          message: `execution ${executionName} finished with state: ${execution.state}`,
          tags: ['info', 'workflows', workflow],
          execution_result: execution.result
        })
        return {
          value: execution.result
        }
      }
    }
    return {
      error: new Error(`execution ${executionName} timed out`)
    }
  } catch (err: any) {
    log({
      message: `Error executing workflow: ${err.message}`,
      tags: ['error', 'workflows', workflow]
    })
    return {
      error: err as Error
    }
  }
}

export interface CancelExecution {
  client: ExecutionsClient
  location: string
  project: string
  workflow: string
  execution: string
}

export const cancelExecution = async ({
  client,
  location,
  project,
  workflow,
  execution
}: CancelExecution) => {
  const name = `projects/${project}/locations/${location}/workflows/${workflow}/executions/${execution}`

  try {
    const cancelExecutionRes = await client.cancelExecution({
      name
    })

    const executionName = cancelExecutionRes[0].name

    log({
      message: `canceled execution ${execution} of workflow ${workflow} in ${location}`,
      tags: ['info', 'workflows', workflow, executionName]
    })

    return {
      value: { message: `execution ${executionName} canceled` }
    }
  } catch (err: any) {
    log({
      message: `Error when trying to cancel execution ${execution} of workflow ${workflow} ${err.message}`,
      tags: ['error', 'workflows', workflow, execution]
    })

    return {
      error: err as Error
    }
  }
}
