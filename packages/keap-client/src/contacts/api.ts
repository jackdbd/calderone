import makeDebug from "debug";
import phin from "phin";
import { isContactNotFound } from "../checks.js";
import {
  access_token_not_set,
  apiError,
  notFoundErrorMessage,
} from "../error.js";
import { headers } from "../headers.js";
import type {
  PaginatedContactsResponse,
  PaginatedContactsClientResponse,
  ResponseBody,
} from "./interfaces.js";
import type { Pagination } from "../pagination.js";
import { queryString, queryStringFromNextUrl } from "../query-string.js";

const debug = makeDebug("keap-client/contacts/api");

const CONTACTS_BASE_URL = "https://api.infusionsoft.com/crm/rest/v1/contacts";

export interface RequestOptions {
  access_token?: string;
}

export interface GetRequestOptions extends RequestOptions {
  optional_properties?: string;
}

export interface RetrieveContactsOptions {
  access_token?: string;
  optional_properties?: string;
  pagination?: Pagination;
}

export const retrieveContacts = async (
  options: RetrieveContactsOptions = {}
) => {
  if (!options.access_token) {
    throw new Error(access_token_not_set);
  }

  const pagination = options.pagination || {};

  const qs = queryString(pagination, options.optional_properties);

  const response = await phin<PaginatedContactsResponse>({
    headers: headers({ access_token: options.access_token }),
    method: "GET",
    parse: "json",
    url: `${CONTACTS_BASE_URL}?${qs}`,
  });

  const b = response.body;

  if (b.fault) {
    throw apiError({ fault: b.fault, message: "cannot retrieve contacts" });
  } else if (b.message && b.message.includes("Invalid date format")) {
    throw apiError({ message: b.message });
  } else {
    debug(`retrieved ${b.contacts.length} contacts`);
    return {
      data: b.contacts,
      count: b.count,
      next: b.next,
      previous: b.previous,
    };
  }
};

export interface RetrieveContactOptions {
  access_token?: string;
  optional_properties?: string;
}

/**
 * Retrieve a contact by ID.
 *
 * https://developer.keap.com/docs/restv2/#!/Contact/getContactUsingGET_3
 */
export const retrieveContactById = async (
  id: number,
  options: RetrieveContactOptions = {}
) => {
  if (!options.access_token) {
    throw new Error(access_token_not_set);
  }

  const qs = queryString({}, options.optional_properties);

  const response = await phin<ResponseBody>({
    headers: headers({ access_token: options.access_token }),
    method: "GET",
    parse: "json",
    url: `${CONTACTS_BASE_URL}/${id}?${qs}`,
  });

  const fault = response.body.fault;
  if (fault) {
    throw apiError({ fault, message: `cannot retrieve contact ID ${id}` });
  } else if (isContactNotFound(response.body.message)) {
    throw new Error(notFoundErrorMessage(`contact with ID ${id}`));
  } else if (response.body.id) {
    return response.body;
  } else {
    throw apiError({ message: `Keap error: ${response.body.message}` });
  }
};

export const retrieveContactsByQueryString = async (
  qs: string,
  options: RetrieveContactsOptions = {}
) => {
  if (!options.access_token) {
    throw new Error(access_token_not_set);
  }

  const response = await phin<PaginatedContactsResponse>({
    headers: headers({ access_token: options.access_token }),
    method: "GET",
    parse: "json",
    url: `${CONTACTS_BASE_URL}/?${qs}`,
  });

  const fault = response.body.fault;
  if (fault) {
    throw apiError({
      fault,
      message: `cannot retrieve contacts using query string ${qs}`,
    });
  } else {
    const value: PaginatedContactsClientResponse = {
      data: response.body.contacts,
      count: response.body.count,
      previous: response.body.previous,
      next: response.body.next,
    };
    return value;
  }
};

export const retrieveContactsByEmail = async (
  email: string,
  options: RetrieveContactsOptions = {}
) => {
  const qs = queryString({ email }, options.optional_properties);
  return await retrieveContactsByQueryString(qs, options);
};

export async function* retrieveContactsAsyncGenerator(
  options: RetrieveContactsOptions = {}
) {
  let qs = "";
  while (true) {
    let value: PaginatedContactsClientResponse;
    if (qs === "") {
      value = await retrieveContacts(options);
    } else {
      value = await retrieveContactsByQueryString(qs, options);
    }

    if (value.data.length === 0) {
      break;
    }

    qs = queryStringFromNextUrl(value.next, options.optional_properties);
    // value.next does NOT contain optional_properties (I think it's a minor
    // bug of the Keap API)
    yield value;
  }
}

export const deleteContactById = async (
  id: number,
  options: RetrieveContactOptions = {}
) => {
  if (!options.access_token) {
    throw new Error(access_token_not_set);
  }

  const response = await phin<ResponseBody>({
    headers: headers({ access_token: options.access_token }),
    method: "DELETE",
    parse: "json",
    url: `${CONTACTS_BASE_URL}/${id}`,
  });

  // https://stackoverflow.com/questions/45153773/correct-http-code-for-authentication-token-expiry-401-or-403
  if (response.statusCode === 401) {
    throw new Error(
      `[401] cannot delete contact ID ${id}: Invalid Access Token`
    );
  } else if (response.statusCode === 404) {
    throw new Error(notFoundErrorMessage(`contact with ID ${id}`));
  } else {
    return id;
  }
};
