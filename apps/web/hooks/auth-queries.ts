import { useMutation } from "@tanstack/react-query";
import { baseUrl, ErrorResponse, fetcher } from "../lib/queryFn";
import { useTokenStore } from "../store/tokenStore";

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