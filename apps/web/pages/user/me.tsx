import { getCurrentUser } from '@acme/auth';
import { getTokens } from '@lib/getTokens';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
// import { useSession } from 'next-auth/react'
import Head from 'next/head'

export const getServerSideProps = (async({ req, res }) => {
  const user = await getCurrentUser({req, res });
  return {
    props: {
      user
    },
  };
}) satisfies GetServerSideProps;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const SessionPage: React.FC<Props> = ({ user }) => { 

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <div className='container mx-auto max-w-3xl'>
          <div className='text-center mb-5'>
            <code className="rounded-md bg-gray-100 p-1 font-mono">
              {JSON.stringify({ ...user })}
            </code>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SessionPage
