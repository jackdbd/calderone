# @jackdbd/telegram-bot

## Development

Build and watch the web application with `tsc` in watch mode, create a HTTPS => HTTP tunnel with [ngrok](https://ngrok.com/) on port 8080 and launch the application with `NODE_ENV = development`:

```sh
npm run dev -w packages/telegram-bot
```

Then visit http://localhost:4040/status to know the public URL ngrok assigned you, and go to http://localhost:4040/inspect/http to inspect/replay past requests that were tunneled by ngrok.

## Build

### non-containerized application

Build the web application:

```sh
npm run build -w packages/telegram-bot
```

Start the application in a `development` / `test` environment:

```sh
npm run start:development -w packages/telegram-bot
npm run start:test -w packages/telegram-bot
```

### containerized application

Build a container image with [pack](https://buildpacks.io/docs/tools/pack):

```sh
npm run container:build -w packages/telegram-bot
```

Start the containerized application in a `development` / `production` / `test` environment:

```sh
npm run container:start:development -w packages/telegram-bot
npm run container:start:production -w packages/telegram-bot
npm run container:start:test -w packages/telegram-bot
```

## Deploy to GCP Cloud Run

Deploy to [Cloud Run](https://console.cloud.google.com/run?project=prj-kitchen-sink) using the `cloudbuild.yaml` file:

```sh
npm run deploy -w packages/telegram-bot
```

## Test

```sh
npm run test -w packages/telegram-bot
```

Healthcheck

```sh
curl "$TELEGRAM_BOT_URL/health"
```

## Commands for this bot

All bot commands must start with `/`

- /cocktail
- /dice
- /sendgif
- /sendpic

You can test the bot by making a POST request passing an [Update](https://core.telegram.org/bots/api#update) object.

```sh
curl -X POST \
--location "$TELEGRAM_BOT_URL" \
--header "Content-Type: application/json" \
--data-raw "{
    \"message\": {\"message_id\": 123, \"text\": \"/dice\", \"chat\": {\"id\": \"$TELEGRAM_CHAT_ID\"}},
    \"update_id\": 456
}"
```

```sh
curl -X POST \
--location "$TELEGRAM_BOT_URL" \
--header "Content-Type: application/json" \
--data-raw "{
    \"message\": {\"message_id\": 123, \"text\": \"/sendpic\", \"chat\": {\"id\": \"$TELEGRAM_CHAT_ID\"}},
    \"update_id\": 456
}"
```

```sh
curl -X POST \
--location "$TELEGRAM_BOT_URL" \
--header "Content-Type: application/json" \
--data-raw "{
    \"message\": {\"message_id\": 123, \"text\": \"/sendgif\", \"chat\": {\"id\": \"$TELEGRAM_CHAT_ID\"}},
    \"update_id\": 456
}"
```

```sh
curl -X POST \
--location "$TELEGRAM_BOT_URL" \
--header "Content-Type: application/json" \
--data-raw "{
    \"message\": {\"message_id\": 123, \"text\": \"/cocktail\", \"chat\": {\"id\": \"$TELEGRAM_CHAT_ID\"}},
    \"update_id\": 456
}"
```
