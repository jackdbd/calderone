import makeDebug from "debug";
import phin from "phin";
import { isInteger } from "../checks.js";
import { newErrorFromApiError } from "../error.js";
import { headers } from "../headers.js";
import type { Credentials } from "../interfaces.js";
import type {
  APIResponseBodyCreate,
  APIResponseBodyDelete,
  APIResponseBodyList,
  CreateRequestBody,
  DeleteRequestBody,
  ListOptions,
  RetrieveConfig,
} from "./interfaces.js";

const debug = makeDebug("fattureincloud-client/products/api");

const API_ENDPOINT = "https://api.fattureincloud.it/v1/prodotti";

/**
 * Retrieve a paginated list of products.
 *
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Prodotti/ProdottiLista
 */
export const list = async (
  { api_key, api_uid }: Credentials,
  options?: ListOptions
) => {
  debug("list options (before validation and defaults) %O", options);

  const categoria = options?.categoria || "";
  const cod = options?.cod || "";
  const nome = options?.nome || "";
  const page = options?.page || 1;

  if (page < 1) {
    throw new Error(`page must be >= 1`);
  }

  if (!isInteger(page)) {
    throw new Error(`page must be an integer`);
  }

  debug("list options (after validation and defaults) %O", {
    categoria,
    cod,
    nome,
    page,
  });

  const response = await phin<APIResponseBodyList>({
    data: {
      api_uid,
      api_key,
      categoria,
      cod,
      nome,
      pagina: page,
    },
    headers: headers(),
    method: "POST",
    parse: "json" as const,
    url: `${API_ENDPOINT}/lista`,
  });

  const b = response.body;

  if (b.error) {
    throw newErrorFromApiError({ error: b.error, error_code: b.error_code });
  }

  const current_page = b.pagina_corrente;
  const total_pages = b.numero_pagine;
  const results = b.lista_prodotti;

  if (page > total_pages) {
    throw new Error(
      `[400] requested page > total pages (${page} > ${total_pages})`
    );
  }

  debug(
    `page ${current_page}/${total_pages}: ${results.length} products in this page`
  );

  return { results, current_page, total_pages };
};

/**
 * Retrieve a single product that matches the search criteria.
 *
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Prodotti/ProdottiLista
 */
export const retrieve = async (
  { api_key, api_uid }: Credentials,
  config: RetrieveConfig
) => {
  const id = config.id || "";
  const cod = config.cod || "";
  const categoria = config.categoria || "";
  const nome = config.nome || "";

  if (id === "" && cod === "") {
    throw new Error("at least one between `cod` and `id` must be set");
  }

  const response = await phin<APIResponseBodyList>({
    data: {
      api_uid,
      api_key,
      categoria,
      cod,
      id,
      nome,
    },
    headers: headers(),
    method: "POST",
    parse: "json" as const,
    url: `${API_ENDPOINT}/lista`,
  });

  const b = response.body;

  if (b.error) {
    throw newErrorFromApiError({ error: b.error, error_code: b.error_code });
  }

  const search_criteria = {
    categoria,
    cod,
    id,
    nome,
  };

  if (b.lista_prodotti.length === 0) {
    throw new Error(
      `[${404}] Found no product that matches search criteria '${JSON.stringify(
        search_criteria
      )}'`
    );
  }

  return b.lista_prodotti[0];
};

/**
 * Create a new product.
 *
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Prodotti/ProdottoNuovoSingolo
 */
export const create = async (
  { api_key, api_uid }: Credentials,
  req_body: CreateRequestBody
) => {
  const response = await phin<APIResponseBodyCreate>({
    data: {
      api_key,
      api_uid,
      ...req_body,
    },
    headers: headers(),
    method: "POST",
    parse: "json" as const,
    url: `${API_ENDPOINT}/nuovo`,
  });

  const b = response.body;

  if (b.error) {
    throw newErrorFromApiError({ error: b.error, error_code: b.error_code! });
  }

  return { id: b.id };
};

/**
 * Delete a product.
 *
 * https://api.fattureincloud.it/v1/documentation/dist/#!/Prodotti/ProdottiElimina
 */
export const deleteProduct = async (
  { api_key, api_uid }: Credentials,
  { id }: DeleteRequestBody
) => {
  debug(`delete product id ${id}`);

  const response = await phin<APIResponseBodyDelete>({
    data: {
      api_key,
      api_uid,
      id,
    },
    headers: headers(),
    method: "POST",
    parse: "json" as const,
    url: `${API_ENDPOINT}/elimina`,
  });

  const b = response.body;

  if (b.error) {
    throw newErrorFromApiError({ error: b.error, error_code: b.error_code! });
  }

  return { id };
};

/**
 * Autopaginate results.
 */
export async function* listAsyncGenerator(
  credentials: Credentials,
  options?: ListOptions
) {
  const start = options?.page || 1;
  let stop = start + 1;

  for (let page = start; page <= stop; page++) {
    const value = await list(credentials, { ...options, page });
    stop = value.total_pages;
    yield value;
  }
}
