import React from 'react'
import { useForm } from 'react-hook-form';
import { FormField } from '@ui/atoms/FormField';
import { Input } from '@ui/atoms/Input';
import { Button } from '@ui/atoms/Button';
import { FormLabel } from '@ui/atoms/FormLabel';
import { FormErrorMessage } from '@ui/atoms/FormErrorMessage';
import { api } from '@lib/queryClient';

type ResendVerificationFormData = {
  email: string;
}

const ResendVerificationForm = () => {
  const { register, handleSubmit } = useForm<ResendVerificationFormData>();

  const resendVerification = api.auth.resendVerificationEmail.useMutation();

  return (
    <>
      { !!resendVerification.data && (
        <div className='mb-5'>
          <code className="rounded-md bg-gray-100 p-1 font-mono">
            {JSON.stringify({...resendVerification.data})}
          </code>
        </div>
      )}
      {/*//@ts-expect-error error body unknown */}
      { !!resendVerification.error?.body?.message && (
        <div className='mb-5'>
          <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
            {/*//@ts-expect-error error body unknown */}
            {resendVerification.error.body.message}
          </code>
        </div>
      )}

      <form onSubmit={handleSubmit(data => resendVerification.mutate({ body: data }))}>
        <FormField>
          <FormLabel>
            Email
          </FormLabel>
          <Input
            type="text"
            {...register('email')}
          />
          {/*//@ts-expect-error error body unknown */}
          { !!resendVerification.error?.body?.messages?.email && (
            <FormErrorMessage>
              {/*//@ts-expect-error error body unknown */}
              {resendVerification.error.body.messages.email}
            </FormErrorMessage>
          )}
        </FormField>

        <Button
          type='submit'
          label="Submit"
        />
      </form>
    </>
  )
}

export default ResendVerificationForm