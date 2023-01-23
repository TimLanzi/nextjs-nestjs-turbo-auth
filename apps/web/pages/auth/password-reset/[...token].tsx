import React, { useMemo } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCheckPasswordResetToken } from '@queries/auth';
import PasswordResetForm from '@components/forms/PasswordResetForm';

const PasswordReset = () => {
  const router = useRouter();
  // base64 string token can include forward slashes. if this is the case, join token fragments with '/'
  const token = useMemo(() => {
    return Array.isArray(router.query.token)
      ? router.query.token.join('/')
      : router.query.token;
  }, [router.query]);
  
  const { data, error, isLoading } = useCheckPasswordResetToken(token);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20">
        <div className='container mx-auto max-w-sm'>
          { isLoading && (
            <>
              Loading...
            </>
          )}
          { !!error && (
            <div className='mb-5'>
              <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
                {JSON.stringify({...error})}
              </code>
            </div>
          )}

          { !!data?.email && (
            <PasswordResetForm
              token={token}
              email={data.email}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default PasswordReset