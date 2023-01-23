import React from 'react'
import Head from 'next/head';
import StartPasswordResetForm from '@components/forms/StartPasswordResetForm';

const StartPasswordReset = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20">
        <div className='container mx-auto max-w-sm'>
          <StartPasswordResetForm />
        </div>
      </main>
    </div>
  )
}

export default StartPasswordReset