import cookies from "js-cookie";
import { create } from "zustand";
import { combine } from "zustand/middleware";

import { isServer } from "~/lib/isServer";

const accessTokenKey = "access-token";
const refreshTokenKey = "refresh-token";

export type TokenData = {
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
  refreshTokenExpires: number;
};

const defaultTokens = {
  accessToken: "",
  refreshToken: "",
  accessTokenExpires: 0,
  refreshTokenExpires: 0,
};

type TokenCookieData = {
  token: string;
  expires: number;
};

const getDefaultTokens = () => {
  if (!isServer) {
    const accessTokenCookie = cookies.get(accessTokenKey);
    const refreshTokenCookie = cookies.get(refreshTokenKey);

    let accessTokenData: TokenCookieData | undefined = undefined;
    if (!!accessTokenCookie) {
      accessTokenData = JSON.parse(accessTokenCookie);
    }
    const accessToken = !!accessTokenData
      ? {
          accessToken: accessTokenData.token,
          accessTokenExpires: accessTokenData.expires,
        }
      : {};

    let refreshTokenData: TokenCookieData | undefined = undefined;
    if (!!refreshTokenCookie) {
      refreshTokenData = JSON.parse(refreshTokenCookie);
    }
    const refreshToken = !!refreshTokenData
      ? {
          refreshToken: refreshTokenData.token,
          refreshTokenExpires: refreshTokenData.expires,
        }
      : {};

    return {
      ...defaultTokens,
      ...accessToken,
      ...refreshToken,
    };
  }

  return { ...defaultTokens };
};

export const useTokenStore = create(
  combine(getDefaultTokens(), (set) => ({
    setTokens: (tokens: TokenData) => {
      const accessTokenExpiresMili = tokens.accessTokenExpires * 1000;
      const refreshTokenExpiresMili = tokens.refreshTokenExpires * 1000;

      const accessTokenValue = JSON.stringify({
        token: tokens.accessToken,
        expires: accessTokenExpiresMili,
      });
      const refreshTokenValue = JSON.stringify({
        token: tokens.refreshToken,
        expires: refreshTokenExpiresMili,
      });

      cookies.set(accessTokenKey, accessTokenValue, {
        sameSite: "strict",
        expires: new Date(accessTokenExpiresMili),
      });
      cookies.set(refreshTokenKey, refreshTokenValue, {
        sameSite: "strict",
        expires: new Date(refreshTokenExpiresMili),
      });

      set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        accessTokenExpires: accessTokenExpiresMili,
        refreshTokenExpires: refreshTokenExpiresMili,
      });
    },

    removeTokens: () => {
      cookies.remove(accessTokenKey);
      cookies.remove(refreshTokenKey);

      set({ ...defaultTokens });
    },
  })),
);
