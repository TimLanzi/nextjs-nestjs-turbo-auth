import { useMutation, useQuery } from "@tanstack/react-query";
import { baseUrl, ErrorResponse, fetcher } from "@lib/queryFn";
import { useTokenStore } from "@stores/tokenStore";

export type LoginFormData = {
  email: string;
  password: string;
}

type LoginResponseData = {
  access_token: string;
  refresh_token: string;
}

export const useLogin = () => {
  const setTokens = useTokenStore(s => s.setTokens);

  return useMutation<LoginResponseData, ErrorResponse, LoginFormData>({
    mutationFn: async(credentials) => {
      const data: LoginResponseData = await fetcher(`${baseUrl}/auth/login`, {
        method: "POST",
        body: credentials,
      });
      
      setTokens(data);
      return data;
    }
  });
}


export type RegisterFormData = {
  email: string;
  password: string;
}

type RegisterResponseData = {
  id: string;
  email: string;
}

export const useRegister = () => {
  const setTokens = useTokenStore(s => s.setTokens);

  return useMutation<RegisterResponseData, ErrorResponse, RegisterFormData>({
    mutationFn: async(credentials) => {
      const data = await fetcher(`${baseUrl}/auth/register`, {
        method: "POST",
        body: credentials,
      });
      setTokens(data);
      return data;
    }
  });
}


export type ResendVerificationFormData = {
  email: string;
}

type ResendVerificationResponseData = {
  id: string;
  email: string;
}

export const useResendVerification = () => {
  return useMutation<ResendVerificationResponseData, ErrorResponse, ResendVerificationFormData>({
    mutationFn: (data) => {
      return fetcher(`${baseUrl}/auth/resend-verification-email`, {
        method: "POST",
        body: data,
      });
    },
  });
}


export type StartPasswordResetFormData = {
  email: string;
}

type StartPasswordResetResponseData = {
  id: string;
  email: string;
}

export const useStartPasswordReset = () => {
  return useMutation<StartPasswordResetResponseData, ErrorResponse, StartPasswordResetFormData>({
    mutationFn: (data) => {
      return fetcher(`${baseUrl}/auth/password-reset`, {
        method: "PUT",
        body: data,
      });
    },
  });
}


type VerifyEmailData = {
  token: string;
}

type VerifyEmailResponseData = {
  id: string;
  email: string;
}

export const useVerifyEmail = () => {
  return useMutation<VerifyEmailResponseData, ErrorResponse, VerifyEmailData>({
    mutationFn: (token) => {
      return fetcher(`${baseUrl}/auth/verify-email`, {
        method: "POST",
        body: token,
      });
    },
  });
}


type CheckPasswordResetResponseData = {
  id: string;
  email: string;
}

export const useCheckPasswordResetToken = (token: string | undefined) => {
  return useQuery<CheckPasswordResetResponseData, ErrorResponse>({
    queryKey: [`/auth/password-reset/${token}`],
    enabled: !!token,
  });
}


export type ResetPasswordFormData = {
  password: string;
}

type ResetPasswordVars = ResetPasswordFormData & {
  email: string;
  token: string;
}

type ResetPasswordResponseData = {
  id: string;
  email: string;
}

export const useResetPassword = () => {
  return useMutation<ResetPasswordResponseData, ErrorResponse, ResetPasswordVars>({
    mutationFn: (data) => {
      return fetcher(`${baseUrl}/auth/password-reset`, {
        method: "POST",
        body: data,
      });
    },
  });
}