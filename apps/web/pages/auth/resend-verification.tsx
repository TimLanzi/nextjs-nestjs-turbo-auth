import React, { FormEventHandler, useEffect, useRef, useState } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query'
import { baseUrl, fetcher } from '../../lib/queryFn';

const ResendVerification = () => {
  const [email, setEmail] = useState('');

  const resendVerification = useMutation({
    mutationFn: (email: string) => {
      return fetcher(`${baseUrl}/auth/resend-verification-email`, {
        method: "POST",
        body: { email },
      });
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    resendVerification.mutate(email);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        { !!resendVerification.data && (
          <div className='mb-5'>
            <code className="rounded-md bg-gray-100 p-3 font-mono">
              {JSON.stringify({...resendVerification.data})}
            </code>
          </div>
        )}
        { !!resendVerification.error && (
          <div className='mb-5'>
            <code className="rounded-md bg-gray-100 p-3 font-mono text-red-600">
              {JSON.stringify({message: resendVerification.error})}
            </code>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <input
              className='border'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <button type='submit'>
            Submit
          </button>
        </form>
      </main>
    </div>
  )
}

export default ResendVerification