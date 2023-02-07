import { QueryFunction } from "@tanstack/react-query";

import { env } from "~/env/client.mjs";
import { authenticate } from "./auth";

/**
 * Overload RequestInit body type to accept any.
 * fetchRequest function will automatically
 * JSON.stringify body so you don't have to.
 */
interface AppRequestInit extends RequestInit {
  body?: any | undefined;
}

/* Params for fetchRequest function */
type FetchRequestParams = Parameters<typeof fetchRequest>;

/**
 * Add authRequired option for fetcher function to determine
 * whether to add auth info to request
 */
type FetcherOptions = [
  FetchRequestParams[0],
  FetchRequestParams[1] & { authRequired?: boolean },
];

export type ErrorResponse = {
  message?: string;
  messages?: {
    [key: string]: string[];
  };
};

/**
 * Wrapper for fetcher function to be used for react-query.
 * queryKey should have the shape ['/request/url'] for non-authed requests
 * and ['/request/url', true] for authed requests.
 */
export const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const path = queryKey[0] as string;
  const authRequired = queryKey[1] as boolean;

  const data = await fetcher(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    authRequired,
  });

  return data;
};

/**
 * Wrapper for both
 * @param args
 * @returns
 */
export async function fetcher(...args: FetcherOptions) {
  const url = args[0];
  const { authRequired, ...options } = args[1];

  let res: Response;
  if (authRequired) {
    res = await authFetchRequest(url, { ...options });
  } else {
    res = await fetchRequest(url, { ...options });
  }

  const data = await res.json();
  if (!res.ok) {
    throw getError(data);
  }

  return data;
}

/**
 * Wrapper of fetch function with application/json set by default
 * and automatic JSON.stringify on body
 * @param url Request url
 * @param options Request options
 * @returns Request data
 */
export async function fetchRequest(
  url: string,
  options?: AppRequestInit | undefined,
) {
  if (options?.body) {
    options.body = JSON.stringify(options.body);
  }
  return fetch(url, {
    ...options,
    // credentials: "include",
    headers: {
      ...options?.headers,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Wrapper of fetchRequest function with refresh token rotation
 * @param url Request url
 * @param options Request options
 * @returns Request data
 */
export async function authFetchRequest(...args: FetchRequestParams) {
  const accessToken = await authenticate();
  if (!accessToken) {
    throw new Error("Not Authenticated");
  }

  return fetchRequest(args[0], {
    ...args[1],
    headers: {
      ...args[1]?.headers,
      "X-Access-Token": `Bearer ${accessToken}`,
    },
  });
}

/**
 * Get proper error shape based on error type
 * @param err Error
 * @returns Formatted error
 */
function getError(err: any) {
  if (!!err.message) {
    // if err.message is an object or array, put errors in `messages` (plural)
    if (typeof err.message === "object" || Array.isArray(err.message)) {
      return { messages: err.message };
    }

    return { message: err.message };
  }

  return { message: err.error };
}
