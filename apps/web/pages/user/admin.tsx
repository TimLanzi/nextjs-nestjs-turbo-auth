import { useQuery } from '@tanstack/react-query'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRedirect } from '@hooks/useRedirect';
import { useSession } from '@hooks/useSession';

const Admin: NextPage = () => {
  useSession({ redirectTo: '/auth/login' });
  const { data, status } = useQuery({ queryKey: ['/user/admin'] });

  useRedirect('/', () => {
    return status === 'error'
  }, [status]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <div className='container mx-auto max-w-sm'>
          { !!data && (
            <div className='mb-5'>
              <code className="rounded-md bg-gray-100 p-1 font-mono">
                {JSON.stringify(data)}
              </code>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Admin
