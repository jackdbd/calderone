import { basicContactsClient, storeContactsClient } from "./contacts/index.js";
import { basicTokensClient, storeTokensClient } from "./tokens/index.js";
import type { Store } from "./tokens-stores/index.js";

interface BasicKeapClientConfig {
  access_token: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
}

interface StoreKeapClientConfig extends BasicKeapClientConfig {
  store: Store;
}

export const basicKeapClient = ({
  access_token,
  client_id,
  client_secret,
  refresh_token,
}: BasicKeapClientConfig) => {
  const contacts = basicContactsClient({ access_token });

  const tokens = basicTokensClient({
    client_id,
    client_secret,
    refresh_token,
  });

  return {
    contacts,
    tokens,
  };
};

export const storeKeapClient = ({
  access_token,
  client_id,
  client_secret,
  refresh_token,
  store,
}: StoreKeapClientConfig) => {
  const contacts = storeContactsClient({ access_token, store });

  const tokens = storeTokensClient({
    client_id,
    client_secret,
    refresh_token,
    store,
  });

  return {
    contacts,
    tokens,
  };
};
