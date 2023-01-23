import { DependencyList, useCallback, useEffect } from "react"
import { useRouter } from "next/router"
import { useSession } from "./useSession";

type Options = {
  enabled?: boolean;
  // from?: boolean;
}

const defaultOptions: Options = {
  enabled: true,
  // from: false,
}

export const useRedirect = (
  url: string | URL,  // only have undefined for typechecking edgecases
  shouldRedirect: (() => boolean) | (() => Promise<boolean>),
  deps: DependencyList,
  options?: Options,
) => {
  options = !!options ? {
    ...defaultOptions,
    ...options,
  } : defaultOptions

  let { enabled } = options;

  const router = useRouter();

  const callback = useCallback(shouldRedirect, deps);

  useEffect(() => {
    async function redirect() {
      if (url && !!(await callback())) {
        console.log(`redirecting to ${url}`)
        router.replace(url);
      }
    }

    if (enabled) redirect()
  }, [url, enabled, callback]);
}

export const useAuthPageRedirect = () => {
  const router = useRouter();
  const { status, data } = useSession();

  useEffect(() => {
    if (status === 'success' && !!data)
      router.replace('/user/me');
  }, [status, data]);
}