import type { NextPage } from 'next'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { Button } from '@ui/atoms/Button'
import { FormErrorMessage } from '@ui/atoms/FormErrorMessage'
import { FormField } from '@ui/atoms/FormField'
import { FormLabel } from '@ui/atoms/FormLabel'
import { Input } from '@ui/atoms/Input'
import { RegisterFormData, useRegister } from '@queries/auth'
import { useRedirect } from '@hooks/useRedirect'
import { useSession } from '@hooks/useSession'

const Register: NextPage = () => {
  const { status, data } = useSession();
  
  const { register, handleSubmit } = useForm<RegisterFormData>();

  const registerUser = useRegister();

  useRedirect('/user/me', () => {
    return !!data
  }, [data], {
    enabled: status === 'success',
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20">
        <div className='container mx-auto max-w-sm'>
          { !!registerUser.data && (
            <div className='mb-5'>
              <code className="rounded-md bg-gray-100 p-1 font-mono">
                {JSON.stringify(registerUser.data)}
              </code>
            </div>
          )}
          
          { !!registerUser.error?.message && (
            <div className='mb-5'>
              <code className="rounded-md bg-gray-100 p-1  font-mono text-red-600">
                {registerUser.error.message}
              </code>
            </div>
          )}

          <form onSubmit={handleSubmit(data => registerUser.mutate(data))}>
            <FormField>
              <FormLabel>
                Email
              </FormLabel>
              <Input
                type="text"
                {...register('email')}
              />
              { !!registerUser.error?.messages?.email && (
                <FormErrorMessage>
                  {registerUser.error.messages.email.join('')}
                </FormErrorMessage>
              )}
            </FormField>

            <FormField>
              <FormLabel>
                Password
              </FormLabel>
              <Input
                type="text"
                {...register('password')}
              />
              { !!registerUser.error?.messages?.password && (
                <FormErrorMessage>
                  {registerUser.error.messages.password.join('')}
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

export default Register
