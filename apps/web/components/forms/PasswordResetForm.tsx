import React from 'react'
import { useForm } from 'react-hook-form';
import { ResetPasswordFormData, useResetPassword } from '@queries/auth';
import { FormField } from '@ui/atoms/FormField';
import { Input } from '@ui/atoms/Input';
import { Button } from '@ui/atoms/Button';
import { FormLabel } from '@ui/atoms/FormLabel';
import { FormErrorMessage } from '@ui/atoms/FormErrorMessage';

type Props = {
  token: string;
  email: string;
}

const PasswordResetForm: React.FC<Props> = ({ token, email }) => {
  const { register, handleSubmit } = useForm<ResetPasswordFormData>();
  
  const resetPassword = useResetPassword()

  return (
    <>
      { !!resetPassword.data && (
        <div className='mb-5'>
          <code className="rounded-md bg-gray-100 p-1 font-mono">
            {JSON.stringify({...resetPassword.data})}
          </code>
        </div>
      )}
      { !!resetPassword.error?.message && (
        <div className='mb-5'>
          <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
            {JSON.stringify({error: resetPassword.error?.message})}
          </code>
        </div>
      )}
      <form
        onSubmit={handleSubmit(form => {
          return resetPassword.mutate({
            token,
            email,
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
    </>
  )
}

export default PasswordResetForm