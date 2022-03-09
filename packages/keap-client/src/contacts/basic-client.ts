import makeDebug from "debug";
import {
  retrieveContacts,
  retrieveContactById,
  retrieveContactsByQueryString,
  retrieveContactsByEmail,
  retrieveContactsAsyncGenerator,
} from "./api.js";
import type { RetrieveContactOptions, RetrieveContactsOptions } from "./api.js";

const debug = makeDebug("keap-client/contacts/basic-client");

interface ContactsClientConfig {
  access_token: string;
}

/**
 * Create a client for the `/contacts` Keap API endpoint.
 *
 * https://developer.infusionsoft.com/docs/rest/#!/Contact/listContactsUsingGET_2
 */
export const contactsClient = (config: ContactsClientConfig) => {
  debug(`create client for Keap contacts`);

  const retrieve = async (options: RetrieveContactsOptions) => {
    const access_token = options.access_token || config.access_token;
    return retrieveContacts({ ...options, access_token });
  };

  const retrieveById = async (id: number, options: RetrieveContactOptions) => {
    const access_token = options.access_token || config.access_token;
    return retrieveContactById(id, { ...options, access_token });
  };

  const retrieveByQueryString = async (
    qs: string,
    options: RetrieveContactsOptions
  ) => {
    const access_token = options.access_token || config.access_token;
    return retrieveContactsByQueryString(qs, { ...options, access_token });
  };

  const retrieveByEmail = async (
    email: string,
    options: RetrieveContactsOptions
  ) => {
    const access_token = options.access_token || config.access_token;
    return retrieveContactsByEmail(email, { ...options, access_token });
  };

  const retrieveAsyncGenerator = async (options: RetrieveContactsOptions) => {
    const access_token = options.access_token || config.access_token;
    return retrieveContactsAsyncGenerator({ ...options, access_token });
  };

  return {
    retrieve,
    retrieveAsyncGenerator,
    retrieveById,
    retrieveByQueryString,
    retrieveByEmail,
  };
};
