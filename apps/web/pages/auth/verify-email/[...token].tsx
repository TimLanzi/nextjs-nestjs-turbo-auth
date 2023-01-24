import React, { useEffect, useMemo, useRef } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { api } from '@lib/queryClient';

const VerifyEmail = () => {
  const sentRequest = useRef(false);
  const router = useRouter();
  // base64 string token can include forward slashes. if this is the case, join token fragments with '/'
  const token = useMemo(() => {
    return Array.isArray(router.query.token)
      ? router.query.token.join('/')
      : router.query.token;
  }, [router.query]);

  const verifyEmail = api.auth.verifyEmail.useMutation();

  useEffect(() => {
    if (!!token && !sentRequest.current) {
      verifyEmail.mutate({ body: { token }});
      sentRequest.current = true;
    }
  }, [token, verifyEmail])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <div className='container mx-auto max-w-sm'>
          { verifyEmail.isLoading && (
            <>
              Loading...
            </>
          )}
          { !!verifyEmail.error && (
            <div className='mb-5'>
              <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
                {JSON.stringify({ ...verifyEmail.error.body as any })}
              </code>
            </div>
          )}
          { !!verifyEmail.data && (
            <div className='mb-5 flex flex-col'>
              <code className="rounded-md bg-gray-100 p-1 font-mono">
                {JSON.stringify({ ...verifyEmail.data.body })}
              </code>
              <Link className="text-blue-500" href="/auth/login">
                Log in
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default VerifyEmail