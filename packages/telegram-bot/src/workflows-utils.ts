import type { ExecutionsClient } from '@google-cloud/workflows'
import { makeLog } from '@jackdbd/tags-logger'
import { APP_ID } from './constants.js'

const log = makeLog({
  // https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
  namespace: process.env.K_SERVICE ? undefined : `${APP_ID}:workflows-utils`
})

interface CallWorkflowConfig {
  client: ExecutionsClient
  location: string
  project: string
  workflow: string
}

/**
 * Calls the Workflow API and waits for the execution result.
 */
export const callWorkflowsAPI = async ({
  client,
  location,
  project,
  workflow
}: CallWorkflowConfig) => {
  // Execute workflow
  try {
    const createExecutionRes = await client.createExecution({
      parent: client.workflowPath(project, location, workflow)
    })

    const executionName = createExecutionRes[0].name

    log({
      message: `created execution ${executionName} of workflow ${workflow} in ${location}`,
      tags: ['info', 'workflows', workflow, executionName]
    })

    // Wait for execution to finish, then print results.
    let executionFinished = false
    let backoffDelay = 1000 // Start wait with delay of 1,000 ms

    log({
      message: `poll every 1s for result of execution ${executionName} of workflow ${workflow}...`,
      tags: ['debug', 'workflows', workflow, executionName]
    })

    while (!executionFinished) {
      const [execution] = await client.getExecution({
        name: executionName
      })
      executionFinished = execution.state !== 'ACTIVE'

      // If we haven't seen the result yet, wait a second.
      if (!executionFinished) {
        log({
          message: `waiting for results of execution ${executionName} of workflow ${workflow}...`,
          tags: ['debug', 'workflows', workflow, executionName]
        })

        await new Promise((resolve) => {
          setTimeout(resolve, backoffDelay)
        })

        backoffDelay *= 2 // Double the delay to provide exponential backoff.
      } else {
        log({
          message: `execution ${executionName} of workflow ${workflow} finished with state: ${execution.state}`,
          tags: ['info', 'workflows', workflow, executionName],
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
