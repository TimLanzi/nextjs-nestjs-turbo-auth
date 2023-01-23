import { useTokenStore } from "@stores/tokenStore";
import { JWT } from "next-auth/jwt";
import { fetchRequest } from "./queryFn";

export async function getTokens(): Promise<JWT> {
  const { accessToken, refreshToken, accessTokenExpires, refreshTokenExpires, setTokens } = useTokenStore.getState();

  if (!(accessToken || refreshToken) || (accessTokenExpires <= Date.now())) {
    console.log("GET NEW TOKENS")
    const tokens = await getTokensApi();
    setTokens({ ...tokens });

    return tokens;
  }

  return {
    accessToken,
    refreshToken,
    accessTokenExpires,
    refreshTokenExpires,
  };
}

async function getTokensApi(): Promise<JWT> {
  const data = await fetchRequest('/api/auth/token')
    .then(res => res.json());
  return !!data?.token ? data.token : { accessToken: '', refreshToken: '' };
}