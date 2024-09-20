import { env } from 'node:process'
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
    const json = env.TELEGRAM
    const secret = JSON.parse(json)
    const { chat_id, token } = secret
    const text = `Jest test launched at ${new Date().toISOString()} UTC`

    const { delivered, message } = await send({ chat_id, token, text })

    expect(delivered).toBeTruthy()
    expect(message).toContain(`${chat_id}`)
  })
})
