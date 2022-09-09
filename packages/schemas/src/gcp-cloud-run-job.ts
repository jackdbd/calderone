import Joi from 'joi'

const TAG = 'cloud-run-job'

export const job_id = Joi.string()
  .min(1)
  .label('Cloud Run Jobs job ID')
  .tag(TAG, 'job')

export const region_id = Joi.string()
  .min(1)
  .label('Cloud Run Jobs job region')
  .tag(TAG, 'region')

export const task_index = Joi.number()
  .min(0)
  .label('Cloud Run Jobs job task index')
  .tag(TAG, 'task')
