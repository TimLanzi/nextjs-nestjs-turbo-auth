import { useMutation } from '@tanstack/react-query'
import type { NextPage } from 'next'
import Head from 'next/head'
import { FormEventHandler, useState } from 'react'
import { useRedirect } from '../../hooks/useRedirect'
import { useSession } from '../../hooks/useSession'
import { fetcher } from '../../lib/queryFn'
import { useTokenStore } from '../../store/tokenStore'

const Register: NextPage = () => {
  const { status, data } = useSession();
  const setTokens = useTokenStore(s => s.setTokens);

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  useRedirect('/auth/me', () => {
    return !!data
  }, [data], {
    enabled: status === 'success',
  });

  const register = useMutation({
    mutationFn: async(credentials: typeof form) => {
      const data = await fetcher(`http://localhost:4000/auth/register`, {
        method: "POST",
        body: credentials,
      });
      setTokens(data);
      return data;
    }
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    register.mutate(form);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        { register.data && (
          <div className='mb-5'>
            <code className="rounded-md bg-gray-100 p-3 font-mono">
              {JSON.stringify(register.data)}
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

export default Register
