import functions from '@google-cloud/functions-framework'
import { send } from '@jackdbd/notifications/telegram'

functions.http('send-telegram-message', async (req, res) => {
  if (!process.env.NODE_ENV) {
    throw new Error('environment variable NODE_ENV not set')
  }

  if (!process.env.TELEGRAM) {
    throw new Error('environment variable TELEGRAM not set')
  }

  if (!req.body.text) {
    res.status(400).send({ message: '`text` not set' })
    return
  }

  // TELEGRAM is a secret stored in Secret Manager. It's a JSON, so we parse it.
  const { chat_id, token } = JSON.parse(process.env.TELEGRAM)

  // const host = req.headers['host']
  // const ua = req.headers['user-agent']
  // console.log({ host, 'user-agent': ua })

  const config = {
    chat_id,
    text: req.body.text,
    token
  }

  const options = {
    disable_notification: true,
    disable_web_page_preview: false,
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
})
