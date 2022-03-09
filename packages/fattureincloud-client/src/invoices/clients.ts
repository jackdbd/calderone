import makeDebug from "debug";
import type Bottleneck from "bottleneck";
import type { Credentials } from "../interfaces.js";
import { rateLimitedClient as withRateLimit } from "../rate-limit.js";
import {
  createInvoice,
  deleteInvoice,
  listInvoices,
  listInvoicesAsyncGenerator,
  retrieveInvoice,
} from "./api.js";
import type {
  CreateRequestBody,
  DeleteRequestBody,
  ListOptions,
  RetrieveConfig,
} from "./interfaces.js";

const debug = makeDebug("fattureincloud-client/invoices/client");

export const basicClient = (credentials: Credentials) => {
  debug("make FattureInCloud invoices API client");

  return {
    create: (config: CreateRequestBody) => {
      return createInvoice(credentials, config);
    },

    delete: (config: DeleteRequestBody) => {
      return deleteInvoice(credentials, config);
    },

    list: (options?: ListOptions) => {
      return listInvoices(credentials, options);
    },

    listAsyncGenerator: (options?: ListOptions) => {
      return listInvoicesAsyncGenerator(credentials, options);
    },

    retrieve: (config: RetrieveConfig) => {
      return retrieveInvoice(credentials, config);
    },
  };
};

export const rateLimitedClient = (
  credentials: Credentials,
  options?: Bottleneck.ConstructorOptions
) => {
  return withRateLimit(basicClient(credentials), options);
};
