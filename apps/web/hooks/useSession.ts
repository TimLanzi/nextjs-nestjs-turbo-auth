import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { baseUrl, fetcher } from "@lib/queryFn";
import { useTokenStore } from "@stores/tokenStore";

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
  required?: false | undefined;
} | {
  required: true;
  onUnauthenticated: () => void;
}

export const useSession = (options?: Options) => {
  const router = useRouter();
  const client = useQueryClient();
  const [hasTokens, removeTokens] = useTokenStore(s => [
    !!(s.accessToken || s.refreshToken),
    s.removeTokens
  ]);
  const { data, status, remove, refetch, ...rest } = useQuery<SessionUser, Error>({
    queryKey: ['/auth/me'],
    enabled: hasTokens,
  });

  const userLoggedIn = useMemo(() => {
    return hasTokens && (status === 'success' && !!data)
  }, [status, data, hasTokens]);

  useEffect(() => {
    if (status !== 'loading' && options?.required && !userLoggedIn) {
      options.onUnauthenticated()
    }
  }, [options, status, userLoggedIn]);

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