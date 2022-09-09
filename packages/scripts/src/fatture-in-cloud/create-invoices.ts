import phin from 'phin'
import { range } from '@jackdbd/utils/array'
import { nowAndFutureUTC } from '@jackdbd/utils/dates'
import { basicClient } from '@jackdbd/fattureincloud-client/invoices'
import type { CreateRequestBody } from '@jackdbd/fattureincloud-client/invoices/interfaces'
import { makeWaitMs } from '@jackdbd/utils'
import { localJSONSecret } from '../utils.js'

interface Config {
  api_key: string
  api_uid: string
  request_bodies: CreateRequestBody[]
  throttling: number
}

const requestsWithFattureInCloudClient = async ({
  api_key,
  api_uid,
  request_bodies,
  throttling
}: Config) => {
  const invoices = basicClient({ api_key, api_uid })

  const promises = request_bodies.map((body, i) => {
    const waitMs = makeWaitMs(throttling * i)

    return waitMs()
      .then((message) => {
        console.log(message)
      })
      .then(() => {
        return invoices.create(body)
      })
  })

  const results = await Promise.allSettled(promises)
  for (const res of results) {
    if (res.status === 'fulfilled') {
      console.log(res.value)
    } else {
      console.log('res.reason', res.reason)
    }
  }
}

const requestsWithPhin = async ({
  api_key,
  api_uid,
  request_bodies,
  throttling
}: Config) => {
  const promises = request_bodies.map((body, i) => {
    const waitMs = makeWaitMs(throttling * i)

    return waitMs().then((message) => {
      console.log(message)
      return phin({
        data: {
          api_key,
          api_uid,
          lista_articoli: body.lista_articoli,
          lista_pagamenti: body.lista_pagamenti,
          nome: body.ragione_sociale,
          numero: body.numero
        },
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        parse: 'json' as const,
        url: 'https://api.fattureincloud.it/v1/fatture/nuovo'
      })
    })
  })

  const results = await Promise.allSettled(promises)
  for (const res of results) {
    if (res.status === 'fulfilled') {
      const { body, statusCode, statusMessage } = res.value
      console.log(`[${statusCode}]: ${statusMessage}`, body)
      //   console.log(res.value.headers)
    } else {
      console.log('res.reason', res.reason)
    }
  }
}

// run this script:
// npx tsm packages/scripts/src/fatture-in-cloud/create-invoices.ts

export const main = async () => {
  const indexes = range(0, 3)

  const { future } = nowAndFutureUTC(1)
  const data_scadenza = new Date(future).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  const request_bodies: CreateRequestBody[] = indexes.map((i) => {
    return {
      ragione_sociale: `test customer ${i}`,
      lista_articoli: [
        { cod_iva: '0', nome: 'test article', prezzo_netto: 1.0 }
      ],
      lista_pagamenti: [{ importo: 1.22, metodo: 'not', data_scadenza }],
      numero: 'TEST'
    }
  })

  const { api_key, api_uid } = await localJSONSecret('fattureincloud.json')

  const config: Config = {
    api_key,
    api_uid,
    request_bodies,
    // The FattureInCloud API refuses to create/update invoices when the HTTP
    // requests are too close in time, so we can't make multiple requests at the
    // exact same time. Since it's nice to use Promise.all() or
    // Promise.allSettled(), a simple workarond is to delay each request of an
    // increasing amount of time. 30-50ms between one request and the next one
    // should be enough.
    throttling: 100 // ms
  }
  await requestsWithFattureInCloudClient(config)
  await requestsWithPhin(config)
}

main()
