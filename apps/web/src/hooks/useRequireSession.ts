import { useRouter } from "next/router";

import { useSession } from "./useSession";

/**
 * Wrapper for useSession that requires session to exist.
 * Will redirect to signin page automatically if no session.
 */
export function useRequireSession() {
  const router = useRouter();

  const data = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/auth/login");
    },
  });

  return data;
}
