import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { logout as signOut } from "~/lib/auth";
import { useTokenStore } from "~/stores/tokens";

type SessionUser = {
  id: string;
  email: string;
  name?: string;
  role: string;
};

type Error = {
  message: string;
};

type Options =
  | {
      required?: false | undefined;
    }
  | {
      required: true;
      onUnauthenticated: () => void;
    };

export function useSession(options?: Options) {
  const router = useRouter();
  const client = useQueryClient();
  const hasTokens = useTokenStore((s) => !!(s.accessToken || s.refreshToken));
  const { data, status, remove, refetch, ...rest } = useQuery<
    SessionUser,
    Error
  >({
    queryKey: ["/auth/me", true],
    enabled: hasTokens,
  });

  const userLoggedIn = useMemo(() => {
    return hasTokens && status === "success" && !!data;
  }, [status, data, hasTokens]);

  useEffect(() => {
    if (
      (!hasTokens || status !== "loading") &&
      !!options?.required &&
      !userLoggedIn
    ) {
      options.onUnauthenticated();
    }
  }, [options, status, userLoggedIn]);

  const logout = async () => {
    await signOut();
    client.clear();
    router.push("/auth/login");
  };

  return {
    ...rest,
    data,
    status,
    isLoggedIn: hasTokens,
    logout,
  };
}
