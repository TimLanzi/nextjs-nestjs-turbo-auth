import { QueryFunction } from "@tanstack/react-query"
import { getTokens } from "./tokenStore";

export const defaultQueryFn: QueryFunction = async({ queryKey }) => {
  const tokens = getTokens();

  const res = await fetcher(`http://localhost:4000${queryKey[0]}`, {
    headers: {
      'X-Access-Token': `Bearer ${tokens.accessToken}`,
    },
  });
  const data = await res.json()

  return data;
}

export const fetcher = (url: string, options?: RequestInit | undefined) => {
  return fetch(url, {
    ...options,
    // credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
}