import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import yargs from 'yargs'
import { send } from '../../packages/notifications/lib/telegram.js'
import { monorepoRoot } from '../../packages/utils/lib/path.js'

// https://core.telegram.org/bots/api#markdownv2-style
const markdown_v2_text =
  '[inline URL](http://www.example.com/) [inline mention of a user](tg://user?id=123456789) *bold text* _italic text_ __underline text__ ~strikethrough text~ `inline fixed-width code`'

//https://core.telegram.org/bots/api#html-style
const html_text = `
<b>bold</b>, <strong>bold</strong>
<i>italic</i>, <em>italic</em>
<u>underline</u>, <ins>underline</ins>
<s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
<span class="tg-spoiler">spoiler</span>, <tg-spoiler>spoiler</tg-spoiler>
<b>bold <i>italic bold <s>italic bold strikethrough <span class="tg-spoiler">italic bold strikethrough spoiler</span></s> <u>underline italic bold</u></i> bold</b>
<a href="http://www.example.com/">inline URL</a>
<a href="tg://user?id=123456789">inline mention of a user</a>
<code>inline fixed-width code</code>
<pre>pre-formatted fixed-width code block</pre>
<pre><code class="language-python">pre-formatted fixed-width code block written in the Python programming language</code></pre>
`

const json_path = join(monorepoRoot(), 'secrets', 'telegram.json')
const json = readFileSync(json_path).toString()
const secret = JSON.parse(json)

const DEFAULT = {
  chat_id: secret.chat_id,
  token: secret.token,
  text: 'Hello <b>world</b>!'
}

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .describe('chat_id', 'Telegram chat id where to deliver the message to')
    .describe('token', 'token of the Telegram bot used to deliver the message')
    .describe('text', 'text message to send (HTML)')
    .default(DEFAULT).argv

  try {
    const config = {
      chat_id: argv.chat_id,
      token: argv.token,
      text: html_text
    }
    const res = await send(config, { parse_mode: 'HTML' })
    console.log(res)
  } catch (err) {
    console.error(err.message)
  }

  try {
    const config = {
      chat_id: argv.chat_id,
      token: argv.token,
      text: markdown_v2_text
    }
    const res = await send(config, { parse_mode: 'MarkdownV2' })
    console.log(res)
  } catch (err) {
    console.error(err.message)
  }

  try {
    const config = {
      chat_id: argv.chat_id,
      token: argv.token,
      text: argv.text
    }
    const res = await send(config)
    console.log(res)
  } catch (err) {
    console.error(err.message)
  }
}

main()
