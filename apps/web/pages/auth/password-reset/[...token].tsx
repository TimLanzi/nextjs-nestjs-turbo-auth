import React, { FormEventHandler, useEffect, useRef, useState } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@tanstack/react-query'
import { baseUrl, fetcher } from '../../../lib/queryFn';

const PasswordRecovery = () => {
  const [password, setPassword] = useState('');
  const { query } = useRouter();
  const token = Array.isArray(query.token) ? query.token.join('/') : query.token;
  
  const { data, error } = useQuery<{id: string, email: string}>({
    queryKey: [`/auth/password-recovery/${token as string}`],
    enabled: !!token,
  });

  const resetPassword = useMutation({
    mutationFn: (x: { email: string, password: string }) => {
      return fetcher(`${baseUrl}/auth/reset-password`, {
        method: "POST",
        body: {
          token,
          email: x.email,
          password: x.password,
        },
      });
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    resetPassword.mutate({
      email: data?.email || '',
      password,
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        { !!resetPassword.data && (
          <div className='mb-5'>
            <code className="rounded-md bg-gray-100 p-3 font-mono">
              {JSON.stringify({...resetPassword.data})}
            </code>
          </div>
        )}
        { !!(resetPassword.error || error) && (
          <div className='mb-5'>
            <code className="rounded-md bg-gray-100 p-3 font-mono text-red-600">
              {JSON.stringify({message: resetPassword.error || error})}
            </code>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <input
              className='border'
              value={password}
              onChange={e => setPassword(e.target.value)}
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

export default PasswordRecovery