import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { defaultQueryFn } from '@lib/queryFn';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={client}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

export default MyApp
