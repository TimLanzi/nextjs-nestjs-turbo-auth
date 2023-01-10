import { useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { baseUrl, fetcher } from "../lib/queryFn";
import { useTokenStore } from "../store/tokenStore";
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

type Options = {
  redirectTo?: string;
}

export const useSession = (options?: Options) => {
  const router = useRouter();
  const client = useQueryClient();
  const [isLoggedIn, removeTokens] = useTokenStore(s => [
    !!(s.accessToken && s.refreshToken),
    s.removeTokens
  ]);
  const { data, status, remove, refetch, ...rest } = useQuery<SessionUser, Error>({
    queryKey: ['/auth/me'],
    enabled: isLoggedIn,
  });

  // Redirect away from page if user is not logged in and there is a redirect path
  useEffect(() => {
    if (!isLoggedIn && options?.redirectTo) {
      router.replace(options?.redirectTo);
    }
  }, []);

  // Redirect away from if there is a redirect path provided and session fetch throws error/there is no data after fetching
  useRedirect(options?.redirectTo, () => {
    return !!options?.redirectTo && (status === 'error' || (status !== 'loading' && !data))
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