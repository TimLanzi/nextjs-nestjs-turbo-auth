import { env } from "~/env/client.mjs";
import { useTokenStore } from "~/stores/tokens";
import { fetchRequest } from "./queryFn";

/**
 * Makes sure the user is authenticated. Returns the accessToken from storage
 * if it exists. If the token is expired, a refresh will be attempted. If the
 * refresh is successful, the new accessToken will be returned. Otherwise,
 * null is returned
 *
 * @returns accessToken or null
 */
export async function authenticate() {
  const {
    accessToken,
    refreshToken,
    accessTokenExpires,
    refreshTokenExpires,
    setTokens,
    removeTokens,
  } = useTokenStore.getState();

  try {
    const hasTokens = !!(accessToken || refreshToken);
    if (!hasTokens) return null;

    if (new Date(accessTokenExpires) < new Date()) {
      throw new AuthorizationError("Expired");
    }

    return accessToken;
  } catch (err) {
    if (err instanceof AuthorizationError) {
      if (!refreshToken || new Date(refreshTokenExpires) < new Date())
        return null;

      const res = await fetchRequest(
        `${env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          headers: {
            "X-Refresh-Token": `Bearer ${refreshToken}`,
          },
        },
      );
      const data = await res.json();

      // Remove tokens if refresh fails
      if (!res.ok && data.message === "RefreshTokenError") {
        removeTokens();
        return null;
      }

      // Set new tokens and return
      setTokens(data);

      return accessToken;
    }

    return null;
  }
}

export async function logout() {
  const { accessToken, refreshToken, removeTokens } = useTokenStore.getState();
  await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "X-Access-Token": `Bearer ${accessToken}`,
      "X-Refresh-Token": `Bearer ${refreshToken}`,
    },
  });

  removeTokens();
}

class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}
