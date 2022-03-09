import makeDebug from "debug";
import type Bottleneck from "bottleneck";
import type { Credentials } from "../interfaces.js";
import { rateLimitedClient as withRateLimit } from "../rate-limit.js";
import {
  create as createProduct,
  deleteProduct,
  list as listProducts,
  listAsyncGenerator as listProductsAsyncGenerator,
  retrieve as retrieveProduct,
} from "./api.js";
import type {
  CreateRequestBody,
  DeleteRequestBody,
  ListOptions,
  RetrieveConfig,
} from "./interfaces.js";

const debug = makeDebug("fattureincloud-client/products/client");

export const basicClient = (credentials: Credentials) => {
  debug("make FattureInCloud products API client");

  return {
    create: (config: CreateRequestBody) => {
      return createProduct(credentials, config);
    },

    delete: (config: DeleteRequestBody) => {
      return deleteProduct(credentials, config);
    },

    list: (options?: ListOptions) => {
      return listProducts(credentials, options);
    },

    listAsyncGenerator: (options?: ListOptions) => {
      return listProductsAsyncGenerator(credentials, options);
    },

    retrieve: (config: RetrieveConfig) => {
      return retrieveProduct(credentials, config);
    },
  };
};

export const rateLimitedClient = (
  credentials: Credentials,
  options?: Bottleneck.ConstructorOptions
) => {
  return withRateLimit(basicClient(credentials), options);
};
