import { useForm } from 'react-hook-form'
import { Button } from '@ui/atoms/Button'
import { FormErrorMessage } from '@ui/atoms/FormErrorMessage'
import { FormField } from '@ui/atoms/FormField'
import { FormLabel } from '@ui/atoms/FormLabel'
import { Input } from '@ui/atoms/Input'
import Link from 'next/link'
import { api } from '@lib/queryClient'

type RegisterFormData = {
  email: string;
  password: string;
}

const RegisterForm = () => {
  const { register, handleSubmit } = useForm<RegisterFormData>();

  const registerUser = api.auth.register.useMutation();

  return (
    <>
      { !!registerUser.data && (
        <div className='mb-5'>
          <code className="rounded-md bg-gray-100 p-1 font-mono">
            {JSON.stringify(registerUser.data)}
          </code>
        </div>
      )}
      
      {/*//@ts-expect-error error body unknown */}
      { !!registerUser.error?.body?.message && (
        <div className='mb-5'>
          <code className="rounded-md bg-gray-100 p-1  font-mono text-red-600">
            {/*//@ts-expect-error error body unknown */}
            {registerUser.error.body.message}
          </code>
        </div>
      )}

      <form onSubmit={handleSubmit(data => registerUser.mutate({ body: data }))}>
        <FormField>
          <FormLabel>
            Email
          </FormLabel>
          <Input
            type="text"
            {...register('email')}
          />
          {/*//@ts-expect-error error body unknown */}
          { !!registerUser.error?.body?.messages?.email && (
            <FormErrorMessage>
              {/*//@ts-expect-error error body unknown */}
              {registerUser.error.body.messages.email.join('')}
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
          {/*//@ts-expect-error error body unknown */}
          { !!registerUser.error?.body?.messages?.password && (
            <FormErrorMessage>
              {/*//@ts-expect-error error body unknown */}
              {registerUser.error.body.messages.password.join('')}
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