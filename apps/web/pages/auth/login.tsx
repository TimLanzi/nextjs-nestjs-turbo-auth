import type { NextPage } from 'next'
import Head from 'next/head'
import { useForm } from "react-hook-form";
import { Button } from '@ui/atoms/Button'
import { FormField } from '@ui/atoms/FormField'
import { FormLabel } from '@ui/atoms/FormLabel'
import { Input } from '@ui/atoms/Input'
import { FormErrorMessage } from '@ui/atoms/FormErrorMessage';
import { useRedirect } from '@hooks/useRedirect'
import { useSession } from '@hooks/useSession'
import { LoginFormData, useLogin } from '@queries/auth';
import Link from 'next/link';

const Login: NextPage = () => {
  const { status, data: session } = useSession();

  const { register, handleSubmit } = useForm<LoginFormData>()

  const login = useLogin();

  useRedirect('/user/me', () => {
    return !!session || !!login.data
  }, [session, login], {
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
          { !!login.error?.message && (
            <div className='mb-5 flex flex-col'>
              <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
                {login.error.message}
              </code>

              { login.error.message.includes("verified") && (
                <Link className='text-blue-500' href="/auth/resend-verification">
                  Send a new link?
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(data => login.mutate(data))}>
            <FormField>
              <FormLabel>
                Email
              </FormLabel>
              <Input
                type="text"
                {...register('email')}
              />
              { !!login.error?.messages?.email && (
                <FormErrorMessage>
                  {login.error.messages.email.join('')}
                </FormErrorMessage>
              )}
            </FormField>

            <FormField>
              <FormLabel>
                Password
              </FormLabel>
              <Input
                type='password'
                {...register('password')}
              />
              { !!login.error?.messages?.password && (
                <FormErrorMessage>
                  {login.error.messages.password.join('')}
                </FormErrorMessage>
              )}
            </FormField>

            <div className='flex space-x-4 items-center'>
              <Button
                type="submit"
                label="Submit"
              />
              <div className='flex flex-col'>
                <Link className='text-blue-500' href="/auth/register">
                  Don't have an account?
                </Link>
                <Link className='text-blue-500' href="/auth/password-reset">
                  Forgot your password?
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Login
