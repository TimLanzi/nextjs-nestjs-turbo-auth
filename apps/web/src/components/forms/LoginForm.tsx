import Link from "next/link";
import { useForm } from "react-hook-form";

import { LoginFormData, useLogin } from "~/queries/auth";
import { Button } from "~/ui/atoms/Button";
import { FormErrorMessage } from "~/ui/atoms/FormErrorMessage";
import { FormField } from "~/ui/atoms/FormField";
import { FormLabel } from "~/ui/atoms/FormLabel";
import { Input } from "~/ui/atoms/Input";

const LoginForm = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();

  const login = useLogin();

  return (
    <>
      {!!login.error?.message && (
        <div className="mb-5 flex flex-col">
          <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
            {login.error.message}
          </code>

          {login.error.message.includes("verified") && (
            <Link className="text-blue-500" href="/auth/resend-verification">
              Send a new link?
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit((data) => login.mutate(data))}>
        <FormField>
          <FormLabel>Email</FormLabel>
          <Input type="text" {...register("email")} />
          {!!login.error?.messages?.email && (
            <FormErrorMessage>
              {login.error.messages.email.join("")}
            </FormErrorMessage>
          )}
        </FormField>

        <FormField>
          <FormLabel>Password</FormLabel>
          <Input type="password" {...register("password")} />
          {!!login.error?.messages?.password && (
            <FormErrorMessage>
              {login.error.messages.password.join("")}
            </FormErrorMessage>
          )}
        </FormField>

        <div className="flex space-x-4 items-center">
          <Button type="submit" label="Submit" />
          <div className="flex flex-col">
            <Link className="text-blue-500" href="/auth/register">
              Don't have an account?
            </Link>
            <Link className="text-blue-500" href="/auth/password-reset">
              Forgot your password?
            </Link>
          </div>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
