import { QueryClient } from "@tanstack/react-query";
import { defaultQueryFn } from '@lib/queryFn';

export const client = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
      retry: false,
      queryFn: defaultQueryFn,
    },
  },
});