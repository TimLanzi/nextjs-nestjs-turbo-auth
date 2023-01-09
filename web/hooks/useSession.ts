import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isLoggedIn } from "../lib/isLoggedIn";
import { baseUrl, fetcher } from "../lib/queryFn";
import { removeTokens } from "../lib/tokenStore"
import { useRedirect } from "./useRedirect";

type SessionUser = {
  id: string;
  email: string;
  name?: string;
  role: string;
}

type Error = {
  message: string;
}

export const useSession = () => {
  const router = useRouter();
  const client = useQueryClient();
  const { data, status, remove, refetch, ...rest } = useQuery<SessionUser, Error>({
    queryKey: ['/auth/me'],
    enabled: isLoggedIn(),
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/auth/login');
    }
  }, []);

  // Redirect to login page if session fetch throws error, or there is no data after fetching
  useRedirect('/auth/login', () => {
    return status === 'error' || (status !== 'loading' && !data)
  }, [status, data]);

  const logout = async() => {
    await fetcher(`${baseUrl}/auth/logout`, {
      method: "POST",
    });

    removeTokens();
    client.clear()
    
    router.push('/auth/login');
  }

  return { ...rest, data, status, logout };
}