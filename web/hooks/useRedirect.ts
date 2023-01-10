import { DependencyList, useCallback, useEffect } from "react"
import { useRouter } from "next/router"

type Options = {
  enabled?: boolean;
}

const defaultOptions: Options = {
  enabled: true,
}

export const useRedirect = (
  url: string | undefined,  // only have undefined for typechecking edgecases
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