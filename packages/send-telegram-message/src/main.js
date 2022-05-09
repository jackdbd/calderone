import { env } from 'node:process'
import { send } from '@jackdbd/notifications/telegram'

if (!env.NODE_ENV) {
  throw new Error('NODE_ENV not set')
}

export const entryPoint = async (req, res) => {
  if (!req.body.text) {
    res.status(400).send({ message: '`text` not set' })
    return
  }

  // TELEGRAM is a secret stored in Secret Manager. It's a JSON, so we parse it.
  if (!env.TELEGRAM) {
    res.status(500).send({ message: 'environment variable TELEGRAM not set' })
  }
  const { chat_id, token } = JSON.parse(env.TELEGRAM)

  const config = {
    chat_id,
    text: req.body.text,
    token
  }

  const options = {
    disable_notification: true,
    parse_mode: 'HTML'
  }

  try {
    const { delivered, delivered_at, message } = await send(config, options)
    res.status(200).send({ delivered, delivered_at, message })
    return
  } catch (err) {
    res.status(500).send({ message: err.message })
    return
  }
}
