import { account } from '../../lib/info/api.js'
import { credentials } from '../api-credentials.mjs'

describe('account', () => {
  it('throws the expected error when passed an invalid API Key or an invalid API UID', async () => {
    expect(
      account({ api_key: 'invalid-api-key', api_uid: 'invalid-api-uid' })
    ).rejects.toThrowError("[401] Parametri 'api_key' e 'api_uid' non validi.")
  })

  it('returns the expected default properties when passed a valid API Key and a valid API UID', async () => {
    const info = await account(credentials())

    expect(info).toHaveProperty('giorni_rimanenti_licenza')
    expect(info).toHaveProperty('piano_licenza')
    expect(info).toHaveProperty('ragione_sociale')

    expect(info).not.toHaveProperty('lista_conti')
  })

  it('returns the expected custom properties when passed a valid API Key and a valid API UID', async () => {
    const options = {
      fields: [
        'durata_licenza',
        'lista_conti',
        'lista_iva',
        'lista_template',
        'lista_valute',
        'nome',
        'tipo_licenza'
      ]
    }

    const info = await account(credentials(), options)

    expect(info).toHaveProperty('giorni_rimanenti_licenza')
    expect(info).toHaveProperty('piano_licenza')
    expect(info).toHaveProperty('ragione_sociale')

    expect(info).toHaveProperty('lista_conti')
  })
})
