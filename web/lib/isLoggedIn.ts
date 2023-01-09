import { getTokens } from "./tokenStore";

export const isLoggedIn = () => {
  const { accessToken, refreshToken } = getTokens();
  return !!(accessToken || refreshToken)
}