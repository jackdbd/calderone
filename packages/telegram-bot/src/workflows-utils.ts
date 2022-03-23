import type { ExecutionsClient } from '@google-cloud/workflows'

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
    console.log(`Created execution: ${executionName}`)

    // Wait for execution to finish, then print results.
    let executionFinished = false
    let backoffDelay = 1000 // Start wait with delay of 1,000 ms
    console.log('Poll every second for result...')
    while (!executionFinished) {
      const [execution] = await client.getExecution({
        name: executionName
      })
      executionFinished = execution.state !== 'ACTIVE'

      // If we haven't seen the result yet, wait a second.
      if (!executionFinished) {
        console.log('- Waiting for results...')
        await new Promise((resolve) => {
          setTimeout(resolve, backoffDelay)
        })
        backoffDelay *= 2 // Double the delay to provide exponential backoff.
      } else {
        console.log(`Execution finished with state: ${execution.state}`)
        console.log(execution.result)
        return {
          success: true,
          result: execution.result
        }
      }
    }
    return {
      success: false
    }
  } catch (err: any) {
    console.error(`Error executing workflow: ${err}`)
    return {
      success: false
    }
  }
}
