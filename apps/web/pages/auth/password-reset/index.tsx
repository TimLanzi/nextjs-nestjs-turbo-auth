import React from 'react'
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { FormField } from '@ui/atoms/FormField';
import { Input } from '@ui/atoms/Input';
import { Button } from '@ui/atoms/Button';
import { FormLabel } from '@ui/atoms/FormLabel';
import { FormErrorMessage } from '@ui/atoms/FormErrorMessage';
import { StartPasswordResetFormData, useStartPasswordReset } from '@queries/auth';

const StartPasswordReset = () => {
  const { register, handleSubmit } = useForm<StartPasswordResetFormData>()

  const startReset = useStartPasswordReset();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20">
        <div className='container mx-auto max-w-sm'>
          { !!startReset.data && (
            <div className='mb-5'>
              <code className="rounded-md bg-gray-100 p-1 font-mono">
                {JSON.stringify({...startReset.data})}
              </code>
            </div>
          )}
          { !!startReset.error?.message && (
            <div className='mb-5'>
              <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
                {startReset.error.message}
              </code>
            </div>
          )}

          <form onSubmit={handleSubmit(data => startReset.mutate(data))}>
            <FormField>
              <FormLabel>
                Email
              </FormLabel>
              <Input
                type="text"
                {...register('email')}
              />
              { !!startReset.error?.messages?.email && (
                <FormErrorMessage>
                  {startReset.error.messages.email}
                </FormErrorMessage>
              )}
            </FormField>
            
            <Button
              type="submit"
              label="Submit"
            />
          </form>
        </div>
      </main>
    </div>
  )
}

export default StartPasswordReset