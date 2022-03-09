// https://developer.infusionsoft.com/docs/rest/#!/Contact/listContactsUsingGET_2
export interface Pagination {
  email?: string;
  family_name?: string;
  given_name?: string;
  limit?: number;
  offset?: number;
  //   optional_properties?: string[]
  order?: string;
  order_direction?: string;
  since?: string;
  until?: string;
}

export interface PaginatedResponse {
  count: number;
  next: string;
  previous: string;
}
