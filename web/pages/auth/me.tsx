import { useQuery } from '@tanstack/react-query'
import type { NextPage } from 'next'
import Head from 'next/head'
import { logout } from '../../lib/auth'

const Session: NextPage = () => {
  const { data, refetch } = useQuery({ queryKey: ['/auth/me'] });

  const handleLogout = async() => {
    await logout();
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
            <button type="button" onClick={() => handleLogout()}>
              Logout
            </button>
            {/* <button type="button" onClick={() => refresh()}>
              Refresh
            </button> */}
          </div>
        )}
      </main>
    </div>
  )
}

export default Session
