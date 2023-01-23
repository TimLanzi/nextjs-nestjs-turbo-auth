import { JWT } from "next-auth/jwt";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const refreshToken = async(token: JWT) => {
  console.log("REFRESH")
  try {
    const res = await fetch(`${baseUrl}/auth/refresh`, {
      headers: {
        "Content-Type": "application/json",
        'X-Refresh-Token': `Bearer ${token.refreshToken}`,
      },
    });
    const data = await res.json();
    
    if (!res.ok) {
      throw {
        ...token,
        ...data,
      };
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      // Convert seconds to miliseconds so we can compare the expiration to Date.now()
      accessTokenExpires: data.accessTokenExpires * 1000,
      refreshTokenExpires: data.refreshTokenExpires * 1000,
    };
  } catch(err) {
    console.error(err)
    return {
      ...token,
      error: "RefreshTokenError",
    };
  }
}

export const fetchSessionUser = async(tokens: JWT) => {
  try {
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        'X-Access-Token': `Bearer ${tokens.accessToken}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw data;
    }

    return data;
  } catch(err) {
    console.error(err);
    return {
      error: "Session Error"
    };
  }
}