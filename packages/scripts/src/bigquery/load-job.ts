import path from 'node:path'
import { env } from 'node:process'
import yargs from 'yargs'
import { BigQuery } from '@google-cloud/bigquery'
import type { Table } from '@google-cloud/bigquery'
import { monorepoRoot } from '@jackdbd/utils/path'

const DEFAULT = {
  'dataset-id': 'performance_audit',
  'project-id': env.GCP_PROJECT_ID,
  'table-id': 'lighthouse_parade'
}

interface Config {
  metadata: any
  schema: any
  table: Table
}

const alterTableSchema = async ({ metadata, schema, table }: Config) => {
  const new_schema = schema

  // https://cloud.google.com/bigquery/docs/schemas#standard_sql_data_types
  const columns = [
    {
      name: 'first_cpu_idle',
      type: 'FLOAT64',
      mode: 'NULLABLE'
    }
  ]
  for (const column of columns) {
    new_schema.fields.push(column)
  }
  metadata.schema = new_schema

  const [result] = await table.setMetadata({
    schema: new_schema
  })
  console.log('table columns', result.schema.fields)
}

const main = async () => {
  const argv = yargs(process.argv.slice(2)).default(DEFAULT).argv

  const csv_filepath = path.join(
    monorepoRoot(),
    'assets',
    'lighthouse-parade-data',
    '2022-01-11T16_27_57',
    'aggregatedMobileReport.csv'
  )

  const project_id = argv['project-id']
  if (!project_id) {
    throw new Error(`--project-id not set`)
  }

  const client = new BigQuery({
    projectId: project_id
  })

  const [datasets] = await client.getDatasets()
  datasets.forEach((ds, i) => {
    console.log(`datasets[${i}]: ${ds.id}`)
  })

  const dataset_id = argv['dataset-id']
  const [tables] = await client.dataset(dataset_id).getTables()

  const table = tables.filter((t) => t.id === argv['table-id'])[0]
  const [metadata] = await table.getMetadata()

  const schema = metadata.schema || { fields: [] }
  console.log(
    `current schema of table ${project_id}:${dataset_id}.${table.id}`,
    schema
  )

  //   await alterTableSchema({ metadata, schema, table })

  const [job] = await table.load(csv_filepath, {
    format: 'CSV',
    ignoreUnknownValues: true,
    skipLeadingRows: 1
  })
  console.log('job.status', job.status)
  console.log('job.statistics', job.statistics)
}

main()
