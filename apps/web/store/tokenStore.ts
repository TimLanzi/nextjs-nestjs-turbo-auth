import cookies from "js-cookie";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { isServer } from "../lib/isServer";

const accessTokenKey = 'access-token';
const refreshTokenKey = 'refresh-token';

export type TokenData = {
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
  refreshTokenExpires: number;
}

const getDefaultTokens = () => {
  if (!isServer) {
    return {
      accessToken: cookies.get(accessTokenKey,) || "",
      refreshToken: cookies.get(refreshTokenKey) || "",
    };
  }

  return {
    accessToken: "",
    refreshToken: "",
  };
}

export const useTokenStore = create(
  combine(getDefaultTokens(), (set) => ({
    setTokens: (tokens: TokenData) => {
      cookies.set(accessTokenKey, tokens.accessToken, {
        sameSite: 'strict',
        expires: new Date(tokens.accessTokenExpires * 1000),
      });
      cookies.set(refreshTokenKey, tokens.refreshToken, {
        sameSite: 'strict',
        expires: new Date(tokens.refreshTokenExpires * 1000),
      });

      set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    },

    removeTokens: () => {
      cookies.remove(accessTokenKey);
      cookies.remove(refreshTokenKey);

      set({ accessToken: '', refreshToken: '' });
    },
  }))
);