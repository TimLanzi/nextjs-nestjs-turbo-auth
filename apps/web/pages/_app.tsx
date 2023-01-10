import '../styles/globals.css'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import type { AppProps } from 'next/app'
import { defaultQueryFn } from '../lib/queryFn';

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
