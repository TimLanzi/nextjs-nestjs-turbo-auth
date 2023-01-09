import cookies from "js-cookie";
import { isServer } from "./isServer";

const accessTokenKey = 'access-token';
const refreshTokenKey = 'refresh-token';

export const getTokens = () => {
  if (!isServer) {
    return {
      accessToken: cookies.get(accessTokenKey) || "",
      refreshToken: cookies.get(refreshTokenKey) || "",
    };
  }

  return {
    accessToken: "",
    refreshToken: "",
  };
}

export const setTokens = (tokens: { access_token: string, refresh_token: string }) => {
  cookies.set(accessTokenKey, tokens.access_token, {
    sameSite: 'strict',
    // 15 minutes
    expires: 1 / 24 / 60 * 5
  });
  cookies.set(refreshTokenKey, tokens.refresh_token, {
    sameSite: 'strict',
    expires: 30,
  });
}

export const removeTokens = () => {
  cookies.remove(accessTokenKey);
  cookies.remove(refreshTokenKey);
}