import makeDebug from "debug";
import type Bottleneck from "bottleneck";
import type { Credentials } from "./interfaces.js";

import {
  basicClient as customersBasicClient,
  rateLimitedClient as customersRateLimitedClient,
} from "./customers/clients.js";

import {
  basicClient as infoBasicClient,
  rateLimitedClient as infoRateLimitedClient,
} from "./info/clients.js";

import {
  basicClient as invoicesBasicClient,
  rateLimitedClient as invoicesRateLimitedClient,
} from "./invoices/clients.js";

import {
  basicClient as productsBasicClient,
  rateLimitedClient as productsRateLimitedClient,
} from "./products/clients.js";

const debug = makeDebug("fattureincloud-client/index");

export const basicClient = (credentials: Credentials) => {
  debug("make FattureInCloud basic API client");

  return {
    customers: customersBasicClient(credentials),
    info: infoBasicClient(credentials),
    invoices: invoicesBasicClient(credentials),
    products: productsBasicClient(credentials),
  };
};

export const rateLimitedClient = (
  credentials: Credentials,
  options?: Bottleneck.ConstructorOptions
) => {
  debug("make FattureInCloud rate-limited API client");

  return {
    customers: customersRateLimitedClient(credentials, options),
    info: infoRateLimitedClient(credentials, options),
    invoices: invoicesRateLimitedClient(credentials, options),
    products: productsRateLimitedClient(credentials, options),
  };
};
