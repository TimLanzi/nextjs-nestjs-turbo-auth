import { baseUrl, fetcher } from "./queryFn";
import { removeTokens } from "./tokenStore"

export const logout = async() => {
  await fetcher(`${baseUrl}/auth/logout`, {
    method: "POST",
  });
  removeTokens();
}