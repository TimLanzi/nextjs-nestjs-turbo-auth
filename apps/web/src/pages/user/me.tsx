import type { NextPage } from "next";
import Head from "next/head";

import { useRequireSession } from "~/hooks/useRequireSession";

const Session: NextPage = () => {
  const { data: session, isLoading, error } = useRequireSession();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <div className="container mx-auto max-w-3xl">
          {isLoading && <div>Loading...</div>}
          {!!error && (
            <div className="mb-5">
              <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
                {JSON.stringify({ ...error })}
              </code>
            </div>
          )}
          {!!session && (
            <div className="text-center mb-5">
              <code className="rounded-md bg-gray-100 p-1 font-mono">
                {JSON.stringify({ ...session })}
              </code>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Session;
