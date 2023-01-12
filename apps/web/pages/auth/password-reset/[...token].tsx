import React from 'react'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { ResetPasswordFormData, useCheckPasswordResetToken, useResetPassword } from '@queries/auth';
import { FormField } from '@ui/atoms/FormField';
import { Input } from '@ui/atoms/Input';
import { Button } from '@ui/atoms/Button';
import { FormLabel } from '@ui/atoms/FormLabel';
import { FormErrorMessage } from '@ui/atoms/FormErrorMessage';

const PasswordReset = () => {
  const { query } = useRouter();
  const token = Array.isArray(query.token) ? query.token.join('/') : query.token;
  
  const { data: checkTokenData, error: checkTokenError, isLoading } = useCheckPasswordResetToken(token);
  const resetPassword = useResetPassword()

  const { register, handleSubmit } = useForm<ResetPasswordFormData>();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20">
        <div className='container mx-auto max-w-sm'>
          { isLoading && (
            <>
              Loading...
            </>
          )}
          
          { !!resetPassword.data && (
            <div className='mb-5'>
              <code className="rounded-md bg-gray-100 p-1 font-mono">
                {JSON.stringify({...resetPassword.data})}
              </code>
            </div>
          )}
          { !!(resetPassword.error?.message || checkTokenError) && (
            <div className='mb-5'>
              <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
                {JSON.stringify({error: resetPassword.error?.message || checkTokenError})}
              </code>
            </div>
          )}

          { !!checkTokenData && (
            <form
              onSubmit={handleSubmit(form => {
                return resetPassword.mutate({
                  token: token as string,
                  email: checkTokenData.email,
                  ...form,
                });
              })}
            >
              <FormField>
                <FormLabel>
                  New Password
                </FormLabel>
                <Input
                  type="password"
                  {...register('password')}
                />
                { !!resetPassword.error?.messages?.password && (
                  <FormErrorMessage>
                    {resetPassword.error.messages.password}
                  </FormErrorMessage>
                )}
              </FormField>

              <Button
                type='submit'
                label='Submit'
              />
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

export default PasswordReset