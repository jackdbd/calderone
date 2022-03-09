import makeDebug from "debug";
import { retrieveRefreshedTokens } from "./api.js";

const debug = makeDebug("keap-client/tokens/basic-client");

export interface TokensClientConfig {
  client_id: string;
  client_secret: string;
  refresh_token: string;
}

export interface RefreshedTokensOptions {
  refresh_token?: string;
}

/**
 * Create a client for the `/token` Keap API endpoint.
 *
 * https://developer.keap.com/getting-started-oauth-keys/
 */
export const tokensClient = (config: TokensClientConfig) => {
  debug(`create client for Keap OAuth tokens`);

  const tokens = async (options: RefreshedTokensOptions = {}) => {
    const refresh_token = options.refresh_token || config.refresh_token;
    return await retrieveRefreshedTokens({
      client_id: config.client_id,
      client_secret: config.client_secret,
      refresh_token,
    });
  };

  return {
    tokens,
  };
};
