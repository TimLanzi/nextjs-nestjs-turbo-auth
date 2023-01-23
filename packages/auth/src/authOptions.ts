import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetchSessionUser, refreshToken } from "./requests";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        const res = await fetch(`${baseUrl}/auth/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Returns access token, refresh token, and their expiration times
        // or returns error with message
        const data = await res.json();

        if (res.ok && data) {
          return data;
        }
        
        // Parse out whether the error message is Zod validation errors or a general message
        throw (typeof data.message === 'object' || Array.isArray(data.message))
          ? new Error(JSON.stringify({ messages: data.message }))
          : new Error(JSON.stringify({ message: data.message }))
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user: resTokens }) {
      // user/resTokens only availible on initial sign-in
      // this block sets initial values for JWT
      if (resTokens) {
        return {
          accessToken: resTokens.accessToken,
          refreshToken: resTokens.refreshToken,
          // Convert seconds to miliseconds on initial set so we can compare the expiration to Date.now()
          accessTokenExpires: resTokens.accessTokenExpires * 1000,
          refreshTokenExpires: resTokens.refreshTokenExpires * 1000,
        };
      };

      if (Date.now() < token.accessTokenExpires) {
        return {
          ...token,

          // take off this payload that can happen through refresh flow
          error: undefined,
          statusCode: undefined,
          message: undefined,
        };
      }

      console.log("TOKEN EXPIRED")
      return refreshToken(token);
    },

    async session({ session, token }) {
      const user = await fetchSessionUser(token);
      session.user = user;
      
      return session;
    }
  },
  events: {
    async signOut({ token }) {
      if (Date.now() < token.accessTokenExpires) {
        await fetch(`${baseUrl}/auth/logout`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'X-Access-Token': `Bearer ${token.accessToken}`,
            'X-Refresh-Token': `Bearer ${token.refreshToken}`,
          },
        });
        return;
      }

      const newTokens = await refreshToken(token);

      await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': `Bearer ${newTokens.accessToken}`,
          'X-Refresh-Token': `Bearer ${newTokens.refreshToken}`,
        },
      });
    }
  },
  pages: {
    signIn: "/auth/login",
  },
};