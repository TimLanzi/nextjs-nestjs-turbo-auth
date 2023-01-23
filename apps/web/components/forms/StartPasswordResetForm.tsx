import React from 'react'
import { useForm } from 'react-hook-form';
import { FormField } from '@ui/atoms/FormField';
import { Input } from '@ui/atoms/Input';
import { Button } from '@ui/atoms/Button';
import { FormLabel } from '@ui/atoms/FormLabel';
import { FormErrorMessage } from '@ui/atoms/FormErrorMessage';
import { StartPasswordResetFormData, useStartPasswordReset } from '@queries/auth';

const StartPasswordResetForm = () => {
  const { register, handleSubmit } = useForm<StartPasswordResetFormData>()

  const startReset = useStartPasswordReset();

  return (
    <>
      { !!startReset.data && (
        <div className='mb-5'>
          <code className="rounded-md bg-gray-100 p-1 font-mono">
            {JSON.stringify({...startReset.data})}
          </code>
        </div>
      )}
      { !!startReset.error?.message && (
        <div className='mb-5'>
          <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
            {startReset.error.message}
          </code>
        </div>
      )}

      <form onSubmit={handleSubmit(data => startReset.mutate(data))}>
        <FormField>
          <FormLabel>
            Email
          </FormLabel>
          <Input
            type="text"
            {...register('email')}
          />
          { !!startReset.error?.messages?.email && (
            <FormErrorMessage>
              {startReset.error.messages.email}
            </FormErrorMessage>
          )}
        </FormField>
        
        <Button
          type="submit"
          label="Submit"
        />
      </form>
    </>
  )
}

export default StartPasswordResetForm