import { useMutation, useQuery } from "@tanstack/react-query";

import { ErrorResponse, fetcher } from "~/lib/queryFn";
import { env } from "~/env/client.mjs";
import { TokenData, useTokenStore } from "~/stores/tokens";

export type LoginFormData = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const setTokens = useTokenStore((s) => s.setTokens);

  return useMutation<TokenData, ErrorResponse, LoginFormData>({
    mutationFn: async (credentials) => {
      const data: TokenData = await fetcher(
        `${env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          body: credentials,
        },
      );

      setTokens(data);
      return data;
    },
  });
};

export type RegisterFormData = {
  email: string;
  password: string;
};

type RegisterResponseData = {
  id: string;
  email: string;
};

export const useRegister = () => {
  const setTokens = useTokenStore((s) => s.setTokens);

  return useMutation<RegisterResponseData, ErrorResponse, RegisterFormData>({
    mutationFn: async (credentials) => {
      const data = await fetcher(`${env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        body: credentials,
      });
      setTokens(data);
      return data;
    },
  });
};

export type ResendVerificationFormData = {
  email: string;
};

type ResendVerificationResponseData = {
  id: string;
  email: string;
};

export const useResendVerification = () => {
  return useMutation<
    ResendVerificationResponseData,
    ErrorResponse,
    ResendVerificationFormData
  >({
    mutationFn: (data) => {
      return fetcher(
        `${env.NEXT_PUBLIC_API_URL}/auth/resend-verification-email`,
        {
          method: "POST",
          body: data,
        },
      );
    },
  });
};

export type StartPasswordResetFormData = {
  email: string;
};

type StartPasswordResetResponseData = {
  id: string;
  email: string;
};

export const useStartPasswordReset = () => {
  return useMutation<
    StartPasswordResetResponseData,
    ErrorResponse,
    StartPasswordResetFormData
  >({
    mutationFn: (data) => {
      return fetcher(`${env.NEXT_PUBLIC_API_URL}/auth/password-reset`, {
        method: "PUT",
        body: data,
      });
    },
  });
};

export type VerifyEmailResponseData = {
  id: string;
  email: string;
};

export type CheckPasswordResetResponseData = {
  id: string;
  email: string;
};

export type ResetPasswordFormData = {
  password: string;
};

type ResetPasswordVars = ResetPasswordFormData & {
  email: string;
  token: string;
};

type ResetPasswordResponseData = {
  id: string;
  email: string;
};

export const useResetPassword = () => {
  return useMutation<
    ResetPasswordResponseData,
    ErrorResponse,
    ResetPasswordVars
  >({
    mutationFn: (data) => {
      return fetcher(`${env.NEXT_PUBLIC_API_URL}/auth/password-reset`, {
        method: "POST",
        body: data,
      });
    },
  });
};
