import { env } from 'node:process'
import { ContainerAnalysisClient } from '@google-cloud/containeranalysis'
import type { GrafeasClient } from '@google-cloud/containeranalysis'
import type { v1beta1 } from '@google-cloud/containeranalysis'
import yargs from 'yargs'

const DEFAULT = {
  'project-id': env.GCP_PROJECT_ID
}

interface Config {
  //   client: v1beta1.GrafeasV1Beta1Client
  client: GrafeasClient
  parent: string
}

const listNotes = async ({ client, parent }: Config) => {
  const [notes] = await client.listNotes({
    parent,
    // filter: 'kind = "VULNERABILITY"'
    filter: ''
  })
  return notes
}

// const createNote = async ({ client, parent }: Config) => {
//   const note_id = 'my-note-id'

//   const [note] = await client.createNote({
//     parent,
//     noteId: note_id,
//     note: {
//       // Associate the Note with a metadata type
//       // https://cloud.google.com/container-registry/docs/container-analysis#supported_metadata_types
//       // Here, we use the type "vulnerabiltity"
//       vulnerability: {
//         details: [
//           {
//             affectedCpeUri: 'foo.uri',
//             affectedPackage: 'foo',
//             // minAffectedVersion: {
//             //   kind: 'MINIMUM'
//             // },
//             fixedVersion: {
//               kind: 'MAXIMUM'
//             }
//           }
//         ]
//       }
//     }
//   })

//   return note
// }

const main = async () => {
  const argv = yargs(process.argv.slice(2)).default(DEFAULT).argv

  const project_id = argv['project-id']
  if (!project_id) {
    console.error('--project-id not set')
    return
  }

  // https://github.com/googleapis/nodejs-containeranalysis
  const client = new ContainerAnalysisClient({ projectId: project_id })

  // Fetch an instance of a Grafeas client:
  // https://googleapis.dev/nodejs/grafeas/latest
  const grafeasClient =
    client.getGrafeasClient() as unknown as v1beta1.GrafeasV1Beta1Client

  const parent = client.projectPath(project_id)

  const notes = await listNotes({ client: grafeasClient, parent })
  console.log(notes)

  //   const note = await createNote({ client: grafeasClient, parent })
  //   console.log('note', note)
}

main()
