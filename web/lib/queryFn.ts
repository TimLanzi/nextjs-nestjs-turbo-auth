import { QueryFunction } from "@tanstack/react-query"
import { getTokens } from "./tokenStore";

export const defaultQueryFn: QueryFunction = async({ queryKey }) => {
  const res = await fetcher(`http://localhost:4000${queryKey[0]}`, {});
  const data = await res.json()

  return data;
}

export const fetcher = (url: string, options?: RequestInit | undefined) => {
  const tokens = getTokens();
  return fetch(url, {
    ...options,
    // credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Token': `Bearer ${tokens.accessToken}`,
      'X-Refresh-Token': `Bearer ${tokens.refreshToken}`,
      ...options?.headers,
    },
  })
}