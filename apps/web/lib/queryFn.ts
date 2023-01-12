import { QueryFunction } from "@tanstack/react-query"
import { useTokenStore } from "@stores/tokenStore";

export const baseUrl = `http://localhost:4000`;

interface AppRequestInit extends RequestInit {
  body?: any | undefined;
}

export type ErrorResponse = {
  message?: string;
  messages?: any;
}

// Wrapper for fetcher function to be used for react-query
export const defaultQueryFn: QueryFunction = async({ queryKey }) => {
  const data = await fetcher(`${baseUrl}${queryKey[0]}`, {});
  // const data = await res.json()

  return data;
}

// Wrapper for fetcheRequest function that implements refresh token attempt
export const fetcher = async(url: string, options?: AppRequestInit | undefined) => {
  const tokens = useTokenStore.getState()

  // Make initial request
  let res = await fetchRequest(url, {
    ...options,
    headers: {
      'X-Access-Token': `Bearer ${tokens.accessToken}`,
      'X-Refresh-Token': `Bearer ${tokens.refreshToken}`,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let data = await res.json();
    if (data.message === 'AccessTokenError') {
      // If request fails, attempt to refresh token
      const newTokens = await refreshToken(tokens.refreshToken);
      // Return initial request data if refresh fails
      if (!newTokens) {
        throw getError(data);
      }
  
      // Make second attempt at request with updated access token
      res = await fetchRequest(url, {
        ...options,
        headers: {
          'X-Access-Token': `Bearer ${newTokens.accessToken}`,
          'X-Refresh-Token': `Bearer ${newTokens.refreshToken}`,
          ...options?.headers,
        },
      });
      data = await res.json();
    
      if (!res.ok) {
        throw getError(data);
      }
      return data;
    }
    throw getError(data);
  }

  let data = await res.json();
  return data;
}

// Wrapper of fetch function with application/json set by default
const fetchRequest = async(url: string, options?: AppRequestInit | undefined) => {
  if (options?.body) {
    options.body = JSON.stringify(options.body);
  }
  return fetch(url, {
    ...options,
    // credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    }
  });
}

// Refreshes tokens
const refreshToken = async(refreshToken: string) => {
  const { removeTokens, setTokens } = useTokenStore.getState();
  const res = await fetch(`${baseUrl}/auth/refresh`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Refresh-Token': `Bearer ${refreshToken}`,
    }
  });
  const data = await res.json();

  // Remove tokens if refresh fails
  if (!res.ok && data.message === 'RefreshTokenError') {
    removeTokens()
    return null;
  }

  // Set new tokens and return
  setTokens(data);
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}

const getError = (err: any) => {
  if (!!err.message) {
    // if err.message is an object or array, put errors in `messages` (plural)
    if (typeof err.message === 'object' || Array.isArray(err.message)) {
      return { messages: err.message };
    }
    
    return { message: err.message };
  }

  return { message: err.error };
}