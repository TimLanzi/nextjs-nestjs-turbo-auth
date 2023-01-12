import React from 'react'
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { ResendVerificationFormData, useResendVerification } from '@queries/auth';
import { FormField } from '@ui/atoms/FormField';
import { Input } from '@ui/atoms/Input';
import { Button } from '@ui/atoms/Button';
import { FormLabel } from '@ui/atoms/FormLabel';
import { FormErrorMessage } from '@ui/atoms/FormErrorMessage';

const ResendVerification = () => {
  const { register, handleSubmit } = useForm<ResendVerificationFormData>();

  const resendVerification = useResendVerification();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20">
        <div className='container mx-auto max-w-sm'>
          { !!resendVerification.data && (
            <div className='mb-5'>
              <code className="rounded-md bg-gray-100 p-1 font-mono">
                {JSON.stringify({...resendVerification.data})}
              </code>
            </div>
          )}
          { !!resendVerification.error?.message && (
            <div className='mb-5'>
              <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
                {resendVerification.error.message}
              </code>
            </div>
          )}

          <form onSubmit={handleSubmit(data => resendVerification.mutate(data))}>
            <FormField>
              <FormLabel>
                Email
              </FormLabel>
              <Input
                type="text"
                {...register('email')}
              />
              { !!resendVerification.error?.messages?.email && (
                <FormErrorMessage>
                  {resendVerification.error.messages.email}
                </FormErrorMessage>
              )}
            </FormField>

            <Button
              type='submit'
              label="Submit"
            />
          </form>
        </div>
      </main>
    </div>
  )
}

export default ResendVerification