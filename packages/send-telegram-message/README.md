# @jackdbd/send-telegram-message

Application that sends a message to a Telegram chat.

## Development

```sh
npm run start:development -w packages/send-telegram-message
```

## Deploy to GCP Cloud Functions

This command uploads the source code to Cloud Build, which builds the container image and deploys the application to [Cloud Functions (2nd generation)](https://cloud.google.com/functions/docs/concepts/version-comparison):

```sh
npm run deploy -w packages/send-telegram-message
```

## Test

Run integration tests with [SuperTest](https://github.com/visionmedia/supertest) and Jest:

```sh
npm run test -w packages/send-telegram-message
```

### Test the function locally

Start the function in one terminal:

```sh
npm run start:development -w packages/send-telegram-message
```

And call it with curl, Postman, etc:

```sh
curl -X POST \
-L "$SEND_TELEGRAM_MESSAGE_URL" \
-H "Content-Type: application/json" \
--data-raw '{
    "text": "Hello world in <b>bold</b> and <i>italic</i>"
}'
```

### Test the function deployed on GCP Cloud Functions

If you want to test the function with curl (or Postman, etc) don't forget to include the identity token in the `Authorization` header, otherwise Google will return a HTTP 403.

Here is how you can make an authenticated request using the **user account** you are currently logged in:

```sh
curl -X POST \
-L "$SEND_TELEGRAM_MESSAGE_URL" \
-H "Authorization: Bearer $(gcloud auth print-identity-token)" \
-H "Content-Type: application/json" \
--data-raw "{
    \"text\": \"This is a message sent by <b>curl</b>\"
}"
```
