import cookies from "js-cookie";
import { isServer } from "./isServer";

const accessTokenKey = 'access-token';

export const getTokens = () => {
  if (!isServer) {
    return {
      accessToken: cookies.get(accessTokenKey) || "",
    };
  }

  return {
    accessToken: "",
  };
}

export const setTokens = (tokens: { access_token: string }) => {
  cookies.set(accessTokenKey, tokens.access_token);
}

export const removeTokens = () => {
  cookies.remove(accessTokenKey);
}