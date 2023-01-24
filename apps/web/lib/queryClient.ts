import { QueryClient } from "@tanstack/react-query";
import { defaultQueryFn, fetcher } from '@lib/queryFn';
import { initQueryClient } from "@ts-rest/react-query";
import { contract } from "@acme/rpc";
import { env } from "@env/client.mjs";

export const client = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn
    },
  },
});

export const api = initQueryClient(contract, {
  baseUrl: '',
  baseHeaders: {
    'Content-Type': 'application/json'
  },
  // jsonQuery: true,
  api: async({ path, method, headers, body }) => {
    try {
      const baseUrl = env.NEXT_PUBLIC_API_URL;
      const { res, data } = await fetcher(`${baseUrl}${path}`, {
        method,
        headers,
        body: !!body ? JSON.parse(body as string) : undefined,
      });
      return { status: res.status, body: data };
    } catch(err: any) {
      const { status, message, messages, _error } = err;
      return { status, body: { message, messages }};
    }
  }
});