import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@ui/atoms/Button'
import { FormErrorMessage } from '@ui/atoms/FormErrorMessage'
import { FormField } from '@ui/atoms/FormField'
import { FormLabel } from '@ui/atoms/FormLabel'
import { Input } from '@ui/atoms/Input'
import { RegisterFormData, useRegister } from '@queries/auth'
import Link from 'next/link'

const RegisterForm = () => {  
  const { register, handleSubmit } = useForm<RegisterFormData>();

  const registerUser = useRegister();

  return (
    <>
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

        <div className='flex space-x-4 items-center'>
          <Button
            type="submit"
            label="Submit"
          />
          <div className='flex flex-col'>
            <Link className='text-blue-500' href="/auth/login">
              Already have an account?
            </Link>
          </div>
        </div>
      </form>
    </>
  )
}

export default RegisterForm