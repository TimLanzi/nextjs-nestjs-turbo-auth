import { useQuery } from '@tanstack/react-query'
import type { NextPage } from 'next'
import cookies from "js-cookie"
import Head from 'next/head'
import Image from 'next/image'
import { FormEventHandler, useState } from 'react'
import { fetcher } from '../../lib/queryFn'
import { removeTokens } from '../../lib/tokenStore'

const Login: NextPage = () => {
  const { data, refetch } = useQuery({ queryKey: ['/auth/me'] });

  const logout = async() => {
    // const res = await fetcher('http://localhost:4000/auth/logout', {
    //   method: 'POST',
    // })
    // const data = await res.json();
    removeTokens()
    refetch();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        { !!data && (
          <div className='mb-5'>
            <code className="rounded-md bg-gray-100 p-3 font-mono">
              {JSON.stringify(data)}
            </code>
            <button type="button" onClick={() => logout()}>
              Logout
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Login
