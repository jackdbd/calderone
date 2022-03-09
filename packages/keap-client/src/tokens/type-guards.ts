import type {
  ErrorWithDescription,
  ErrorWithFault,
  Tokens,
} from "./interfaces.js";

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates
export const isResponseBodyWithToken = (
  body: ErrorWithDescription | ErrorWithFault | Tokens
): body is Tokens => {
  return (body as Tokens).access_token !== undefined;
};

export const isResponseBodyWithFault = (
  body: ErrorWithDescription | ErrorWithFault | Tokens
): body is ErrorWithFault => {
  return (body as ErrorWithFault).fault !== undefined;
};

export const isResponseBodyWithErrorDescription = (
  body: ErrorWithDescription | ErrorWithFault | Tokens
): body is ErrorWithDescription => {
  return (body as ErrorWithDescription).error_description !== undefined;
};
