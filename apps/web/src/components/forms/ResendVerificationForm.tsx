import React from "react";
import { useForm } from "react-hook-form";

import {
  ResendVerificationFormData,
  useResendVerification,
} from "~/queries/auth";
import { Button } from "~/ui/atoms/Button";
import { FormErrorMessage } from "~/ui/atoms/FormErrorMessage";
import { FormField } from "~/ui/atoms/FormField";
import { FormLabel } from "~/ui/atoms/FormLabel";
import { Input } from "~/ui/atoms/Input";

const ResendVerificationForm = () => {
  const { register, handleSubmit } = useForm<ResendVerificationFormData>();

  const resendVerification = useResendVerification();

  return (
    <>
      {!!resendVerification.data && (
        <div className="mb-5">
          <code className="rounded-md bg-gray-100 p-1 font-mono">
            {JSON.stringify({ ...resendVerification.data })}
          </code>
        </div>
      )}
      {!!resendVerification.error?.message && (
        <div className="mb-5">
          <code className="rounded-md bg-gray-100 p-1 font-mono text-red-600">
            {resendVerification.error.message}
          </code>
        </div>
      )}

      <form onSubmit={handleSubmit((data) => resendVerification.mutate(data))}>
        <FormField>
          <FormLabel>Email</FormLabel>
          <Input type="text" {...register("email")} />
          {!!resendVerification.error?.messages?.email && (
            <FormErrorMessage>
              {resendVerification.error.messages.email}
            </FormErrorMessage>
          )}
        </FormField>

        <Button type="submit" label="Submit" />
      </form>
    </>
  );
};

export default ResendVerificationForm;
