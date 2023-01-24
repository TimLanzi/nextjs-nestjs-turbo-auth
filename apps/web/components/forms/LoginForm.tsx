
import { useForm } from "react-hook-form";
import { Button } from '@ui/atoms/Button'
import { FormField } from '@ui/atoms/FormField'
import { FormLabel } from '@ui/atoms/FormLabel'
import { Input } from '@ui/atoms/Input'
import { FormErrorMessage } from '@ui/atoms/FormErrorMessage';
import Link from 'next/link';
import { api } from "@lib/queryClient";
import { useTokenStore } from "@stores/tokenStore";

type LoginFormData = {
  email: string;
  password: string;
}

const LoginForm = () => {
  const setTokens = useTokenStore(s => s.setTokens);
  const { register, handleSubmit } = useForm<LoginFormData>()

  // const login = useLogin();
  const login = api.auth.login.useMutation({
    onSuccess: ({ body }) => setTokens(body),
  });

  return (
    <>
      {/*//@ts-expect-error error body unknown */}
      { !!login.error?.body?.message && (
        <div className='mb-5 flex flex-col'>
          <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
            {/*//@ts-expect-error error body unknown */}
            {login.error.body.message}
          </code>

          {/*//@ts-expect-error error body unknown */}
          { login.error.body.message.includes("verified") && (
            <Link className='text-blue-500' href="/auth/resend-verification">
              Send a new link?
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(data => login.mutate({ body: data }))}>
        <FormField>
          <FormLabel>
            Email
          </FormLabel>
          <Input
            type="text"
            {...register('email')}
          />
          {/*//@ts-expect-error error body unknown */}
          { !!login.error?.body?.messages?.email && (
            <FormErrorMessage>
              {/*//@ts-expect-error error body unknown */}
              {login.error.body.messages.email.join('')}
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
          {/*//@ts-expect-error error body unknown */}
          { !!login.error?.body?.messages?.password && (
            <FormErrorMessage>
              {/*//@ts-expect-error error body unknown */}
              {login.error.body.messages.password.join('')}
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
    </>
  )
}

export default LoginForm