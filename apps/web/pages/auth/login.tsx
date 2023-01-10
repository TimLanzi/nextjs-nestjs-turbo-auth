import { useMutation } from '@tanstack/react-query'
import type { NextPage } from 'next'
import Head from 'next/head'
import { FormEventHandler, useState } from 'react'
import { useRedirect } from '../../hooks/useRedirect'
import { useSession } from '../../hooks/useSession'
import { baseUrl, fetcher } from '../../lib/queryFn'
import { useTokenStore } from '../../store/tokenStore'

const Login: NextPage = () => {
  const { status, data } = useSession();
  const setTokens = useTokenStore(s => s.setTokens);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const login = useMutation({
    mutationFn: async(credentials: typeof form) => {
        const data = await fetcher(`${baseUrl}/auth/login`, {
          method: "POST",
          body: credentials,
        });
        
        setTokens(data);
        return data;
    }
  });

  useRedirect('/auth/me', () => {
    return !!data || !!login.data
  }, [data, login], {
    enabled: status === 'success',
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    login.mutate(form);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        { login.data && (
          <div className='mb-5'>
            <code className="rounded-md bg-gray-100 p-3 font-mono">
              {JSON.stringify(login.data)}
            </code>
          </div>
        )}

        { login.error && (
          <div className='mb-5'>
            <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
              {JSON.stringify(login.error)}
            </code>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <input
              className='border'
              value={form.email}
              onChange={e => setForm(prev => ({
                ...prev,
                email: e.target.value,
              }))}
            />
          </div>

          <div>
            <input
              className='border'
              value={form.password}
              onChange={e => setForm(prev => ({
                ...prev,
                password: e.target.value,
              }))}
            />
          </div>

          <button type="submit">
            Submit
          </button>
        </form>
      </main>
    </div>
  )
}

export default Login
