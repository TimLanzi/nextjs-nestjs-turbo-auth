import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClientProvider } from "@tanstack/react-query";
import Navbar from '@ui/layout/Navbar';
import { client } from '@lib/queryClient';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={client}>
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
    </QueryClientProvider>
  )
}

export default MyApp
