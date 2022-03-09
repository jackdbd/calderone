import makeDebug from "debug";
import phin from "phin";
import { apiError, refresh_token_not_set } from "../error.js";
import { authorizationHeaderValue } from "../headers.js";
import type { ResponseBody } from "./interfaces.js";
import {
  isResponseBodyWithErrorDescription,
  isResponseBodyWithFault,
} from "./type-guards.js";

const debug = makeDebug("keap-client/tokens/api");

const TOKEN_URL = "https://api.infusionsoft.com/token";

interface RefreshConfig {
  // OAuth 2.0 client id
  client_id: string;
  // OAuth 2.0 client secret
  client_secret: string;
  refresh_token: string;
}

/**
 * Refresh request.
 *
 * https://developer.infusionsoft.com/getting-started-oauth-keys/
 * In the Keap API access tokens have a lifetime of 86400 seconds (1 day),
 * while refresh tokens have a lifetime of 45 days.
 * https://community.keap.com/t/invalidclientidentifier-when-refreshing-a-token/78372/3
 * https://developer.infusionsoft.com/tutorials/making-oauth-requests-without-user-authorization/#as-you-go-refresh-the-access-token
 */
export const retrieveRefreshedTokens = async ({
  client_id,
  client_secret,
  refresh_token,
}: RefreshConfig) => {
  const authorization = authorizationHeaderValue({ client_id, client_secret });

  if (!refresh_token) {
    throw new Error(refresh_token_not_set);
  }

  const response = await phin<ResponseBody>({
    headers: {
      Authorization: authorization,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    // https://ethanent.github.io/phin/global.html
    form: {
      grant_type: "refresh_token",
      refresh_token,
      "Header:Authorization": authorization,
    },
    parse: "json",
    url: TOKEN_URL,
  });

  if (isResponseBodyWithFault(response.body)) {
    throw apiError({
      fault: response.body.fault,
      message: "cannot refresh tokens",
    });
  } else if (isResponseBodyWithErrorDescription(response.body)) {
    throw apiError({
      error_description: response.body.error_description,
      message: "cannot refresh tokens",
    });
  }

  const tokens = {
    access_token: response.body.access_token,
    expires_in: response.body.expires_in,
    refresh_token: response.body.refresh_token,
    scope: response.body.scope,
    token_type: response.body.token_type,
  };

  // expires_at sometimes is a datetime, sometimes is undefined
  debug(
    `tokens refreshed (scope: ${tokens.scope}, expires_in: ${tokens.expires_in})`
  );

  return tokens;
};
