import React, { useEffect, useRef } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query'
import { baseUrl, fetcher } from '../../../lib/queryFn';

const VerifyEmail = () => {
  const sentRequest = useRef(false);
  const router = useRouter();

  const verifyEmail = useMutation({
    mutationFn: (token: string) => {
      return fetcher(`${baseUrl}/auth/verify-email`, {
        method: "POST",
        body: { token },
      });
    },
  });

  useEffect(() => {
    if (router.query.token && !sentRequest.current) {
      // base64 string token can include forward slashes. if this is the case, join token fragments with '/'
      const token = Array.isArray(router.query.token) ? router.query.token.join('/') : router.query.token;
      verifyEmail.mutate(token);
      sentRequest.current = true;
    }
  }, [router.query, verifyEmail])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        { !!verifyEmail.data && (
          <div className='mb-5'>
            <code className="rounded-md bg-gray-100 p-3 font-mono">
              {JSON.stringify({...verifyEmail.data})}
            </code>
          </div>
        )}
        { !!verifyEmail.error && (
          <div className='mb-5'>
            <code className="rounded-md bg-gray-100 p-3 font-mono text-red-600">
              {JSON.stringify({message: verifyEmail.error})}
            </code>
          </div>
        )}
      </main>
    </div>
  )
}

export default VerifyEmail