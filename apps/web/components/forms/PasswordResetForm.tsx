import React from 'react'
import { useForm } from 'react-hook-form';
import { FormField } from '@ui/atoms/FormField';
import { Input } from '@ui/atoms/Input';
import { Button } from '@ui/atoms/Button';
import { FormLabel } from '@ui/atoms/FormLabel';
import { FormErrorMessage } from '@ui/atoms/FormErrorMessage';
import { api } from '@lib/queryClient';

type ResetPasswordFormData = {
  password: string;
}

type Props = {
  token: string;
  email: string;
}

const PasswordResetForm: React.FC<Props> = ({ token, email }) => {
  const { register, handleSubmit } = useForm<ResetPasswordFormData>();
  
  const resetPassword = api.auth.resetPassword.useMutation()

  return (
    <>
      { !!resetPassword.data && (
        <div className='mb-5'>
          <code className="rounded-md bg-gray-100 p-1 font-mono">
            {JSON.stringify({...resetPassword.data})}
          </code>
        </div>
      )}
      {/*//@ts-expect-error error body unknown */}
      { !!resetPassword.error?.body?.message && (
        <div className='mb-5'>
          <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
            {/*//@ts-expect-error error body unknown */}
            {JSON.stringify({error: resetPassword.error.body.message})}
          </code>
        </div>
      )}
      <form
        onSubmit={handleSubmit(form => {
          return resetPassword.mutate({ body: {
            token,
            email,
            ...form,
          }});
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
          {/*//@ts-expect-error error body unknown */}
          { !!resetPassword.error?.body?.messages?.password && (
            <FormErrorMessage>
              {/*//@ts-expect-error error body unknown */}
              {resetPassword.error.body.messages.password}
            </FormErrorMessage>
          )}
        </FormField>

        <Button
          type='submit'
          label='Submit'
        />
      </form>
    </>
  )
}

export default PasswordResetForm