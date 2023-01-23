import { JWT } from "next-auth/jwt";
import { create } from "zustand";

export type TokenValues = Pick<JWT, 'accessToken' | 'refreshToken' | 'accessTokenExpires' | 'refreshTokenExpires'>

type TokenState = {
  setTokens: (tokens: TokenValues) => void,
  removeTokens: () => void,
} & TokenValues;

const defaultValues: TokenValues = {
  accessToken: '',
  refreshToken: '',
  accessTokenExpires: 0,
  refreshTokenExpires: 0,
};

export const useTokenStore = create<TokenState>()((set) => ({
  ...defaultValues,
  setTokens: (tokens) => set({ ...tokens }),
  removeTokens: () => set({ ...defaultValues }),
}));