import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { Button } from '@ui/atoms/Button'
import { FormField } from '@ui/atoms/FormField'
import { FormLabel } from '@ui/atoms/FormLabel'
import { Input } from '@ui/atoms/Input'
import { FormErrorMessage } from '@ui/atoms/FormErrorMessage';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { ErrorResponse } from '@lib/queryFn';
import { useRouter } from 'next/router';

export type LoginFormData = {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();

  const { register, handleSubmit } = useForm<LoginFormData>()

  const [error, setError] = useState<ErrorResponse | null>(null)

  const onSubmit = async(data: LoginFormData) => {
    const res = await signIn('credentials', {
      redirect: false,
      ...data,
    });

    if (!res.ok) {
      const parsed = JSON.parse(res.error);
      setError(parsed);
      return;
    }

    router.push(router.query.from as string || "/user/me");
  }

  return (
    <>
      { !!error?.message && (
        <div className='mb-5 flex flex-col'>
          <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
            {error.message}
          </code>

          { error.message.includes("verified") && (
            <Link className='text-blue-500' href="/auth/resend-verification">
              Send a new link?
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(data => onSubmit(data))}>
        <FormField>
          <FormLabel>
            Email
          </FormLabel>
          <Input
            type="text"
            {...register('email')}
          />
          { !!error?.messages?.email && (
            <FormErrorMessage>
              {error.messages.email.join('')}
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
          { !!error?.messages?.password && (
            <FormErrorMessage>
              {error.messages.password.join('')}
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