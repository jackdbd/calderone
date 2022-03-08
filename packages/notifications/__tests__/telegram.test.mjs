import fs from 'node:fs'
import path from 'node:path'
import { env } from 'node:process'
import { isOnGithub } from '../../checks/lib/environment.js'
import { monorepoRoot } from '../../utils/lib/path.js'
import { send } from '../lib/telegram.js'

describe('send', () => {
  it('throws when `chat_id` is not set', async () => {
    await expect(send({})).rejects.toThrow()
  })

  it('throws when `token` is not set', async () => {
    await expect(send({ chat_id: 'some chat id' })).rejects.toThrow()
  })

  it('cannot deliver the message when `chat_id` and `token` are not valid Telegram Bot credentials', async () => {
    const chat_id = 'some chat_id'
    const token = 'some token'

    const { delivered, message } = await send({ chat_id, token })

    expect(delivered).toBeFalsy()
    expect(message).toContain(chat_id)
    expect(message).toContain(message)
  })

  it('delivers the message to the expected Telegram chat, when `chat_id` and `token` are valid Telegram Bot credentials', async () => {
    let json
    if (isOnGithub(env)) {
      json = env.TELEGRAM
    } else {
      const json_path = path.join(monorepoRoot(), 'secrets', 'telegram.json')
      json = fs.readFileSync(json_path).toString()
    }
    const secret = JSON.parse(json)
    const { chat_id, token } = secret
    const text = `Jest test launched at ${new Date().toISOString()} UTC`

    const { delivered, message } = await send({ chat_id, token, text })

    expect(delivered).toBeTruthy()
    expect(message).toContain(`${chat_id}`)
  })
})
