import type { Fault } from "../error.js";
import type { PaginatedResponse } from "../pagination.js";

export interface Address {
  country_code: string;
  field: string;
  line1: string;
  line2: string;
  locality: string;
  postal_code: string;
  region: string;
  zip_code: string;
  zip_four: string;
}

export interface PhoneNumber {
  extension: string;
  field: string;
  number: string;
  type: string;
}

export interface CustomField {
  id: number;
  content: any;
}

export interface EmailAddress {
  email: string;
  field: string;
}

export interface Contact {
  addresses: Address[];
  contact_type: string;
  custom_fields: CustomField[];
  email_addresses: EmailAddress[];
  family_name: string;
  given_name: string;
  id: number;
  phone_numbers: PhoneNumber[];
  tag_ids: number[];
  website: string;
}

export interface PaginatedContactsResponse extends PaginatedResponse {
  contacts: Contact[];
  fault?: Fault;
  message?: string;
}

export interface PaginatedContactsClientResponse extends PaginatedResponse {
  data: Contact[];
}

export interface ResponseBody extends Contact {
  fault?: Fault;
  message?: string;
}
