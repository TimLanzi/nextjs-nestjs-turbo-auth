import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";

import { fetcher } from "~/lib/queryFn";
import { env } from "~/env/client.mjs";
import { VerifyEmailResponseData } from "~/queries/auth";

export const getServerSideProps = (async ({ query }) => {
  const { token, email } = query;
  if (!(token && email)) {
    return {
      props: { error: "Required information not supplied" },
    };
  }

  try {
    const data: VerifyEmailResponseData = await fetcher(
      `${env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
      {
        method: "POST",
        body: { token, email },
      },
    );

    return {
      props: {
        token: token as string,
        data,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { error: "Link was either expired or invalid" },
    };
  }
}) satisfies GetServerSideProps;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

function VerifyEmail({ error, data }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <div className="container mx-auto max-w-sm">
          {!!error && (
            <div className="mb-5">
              <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
                {error}
              </code>
            </div>
          )}
          {!!data && (
            <div className="mb-5 flex flex-col">
              <code className="rounded-md bg-gray-100 p-1 font-mono">
                {JSON.stringify({ ...data })}
              </code>
              <Link className="text-blue-500" href="/auth/login">
                Log in
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default VerifyEmail;
