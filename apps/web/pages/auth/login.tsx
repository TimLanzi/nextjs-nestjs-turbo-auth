import type { NextPage } from 'next'
import Head from 'next/head'
import { useForm } from "react-hook-form";
import { Button } from '../../components/ui/atoms/Button'
import { FormField } from '../../components/ui/atoms/FormField'
import { FormLabel } from '../../components/ui/atoms/FormLabel'
import { Input } from '../../components/ui/atoms/Input'
import { useRedirect } from '../../hooks/useRedirect'
import { useSession } from '../../hooks/useSession'
import { FormErrorMessage } from '../../components/ui/atoms/FormErrorMessage';
import { LoginFormData, useLogin } from '../../hooks/auth-queries';

const Login: NextPage = () => {
  const { status, data } = useSession();

  const { register, handleSubmit } = useForm<LoginFormData>()

  const login = useLogin();

  useRedirect('/user/me', () => {
    return !!data || !!login.data
  }, [data, login], {
    enabled: status === 'success',
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20">
        { !!login.error?.message && (
          <div className='mb-5'>
            <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
              {login.error.message}
            </code>
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

          <Button
            type="submit"
            label="Submit"
          />
        </form>
      </main>
    </div>
  )
}

export default Login
