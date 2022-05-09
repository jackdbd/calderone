# @jackdbd/send-telegram-message

Application that sends a message to a Telegram chat.

## Deploy to GCP Cloud Functions

```sh
npm run deploy -w packages/send-telegram-message
```

## Test

### Test the function locally

Build and run the function

```sh
npm run build -w packages/send-telegram-message
npm run start:local -w packages/send-telegram-message
```

And in another terminal (or in Postman) call it

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
--location "$SEND_TELEGRAM_MESSAGE_URL" \
--header "Authorization: Bearer $(gcloud auth print-identity-token)" \
--header "Content-Type: application/json" \
--data-raw "{
    \"text\": \"This is a message sent by curl\"
}"
```
