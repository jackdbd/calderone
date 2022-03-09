import makeDebug from "debug";
import type Bottleneck from "bottleneck";
import type { Credentials } from "../interfaces.js";
import { rateLimitedClient as withRateLimit } from "../rate-limit.js";
import {
  create as createCustomer,
  deleteCustomer,
  list as listCustomers,
  listAsyncGenerator as listCustomersAsyncGenerator,
  retrieve as retrieveCustomer,
  update as updateCustomer,
} from "./api.js";
import type {
  CreateRequestBody,
  ListOptions,
  DeleteRequestBody,
  RetrieveConfig,
  UpdateRequestBody,
} from "./interfaces.js";

const debug = makeDebug("fattureincloud-client/customers/client");

export const basicClient = (credentials: Credentials) => {
  debug("make FattureInCloud customers API client");

  return {
    create: (config: CreateRequestBody) => {
      return createCustomer(credentials, config);
    },

    delete: (config: DeleteRequestBody) => {
      return deleteCustomer(credentials, config);
    },

    list: (options?: ListOptions) => {
      return listCustomers(credentials, options);
    },

    listAsyncGenerator: (options?: ListOptions) => {
      return listCustomersAsyncGenerator(credentials, options);
    },

    retrieve: (config: RetrieveConfig) => {
      return retrieveCustomer(credentials, config);
    },

    update: (config: UpdateRequestBody) => {
      return updateCustomer(credentials, config);
    },
  };
};

export const rateLimitedClient = (
  credentials: Credentials,
  options?: Bottleneck.ConstructorOptions
) => {
  return withRateLimit(basicClient(credentials), options);
};
