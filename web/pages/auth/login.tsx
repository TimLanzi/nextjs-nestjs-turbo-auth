import { useMutation } from '@tanstack/react-query'
import type { NextPage } from 'next'
import cookies from "js-cookie"
import Head from 'next/head'
import Image from 'next/image'
import { FormEventHandler, useState } from 'react'
import { fetcher } from '../../lib/queryFn'

const Login: NextPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const login = useMutation({
    mutationFn: async(credentials: typeof form) => {
      const res = await fetcher(`http://localhost:4000/auth/login`, {
        method: "POST",
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      // cookies.set('access-token')
      return data;
    }
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
