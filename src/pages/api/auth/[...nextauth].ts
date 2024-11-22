import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";
import spotifyApi, { LOGIN_URL } from "@/lib/spotify";

declare module "next-auth" {
  interface Session {
    accessToken?: JWT["accessToken"];
    refreshToken?: JWT["refreshToken"];
    user: JWT["user"];
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID! || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET! || "",
      authorization: LOGIN_URL,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken;
        spotifyApi.setAccessToken(session.accessToken as string);
        // spotifyApi.setRefreshToken(session.refreshToken as string);
      }
      return session;
    },
    async jwt({ token, account, user }) {
      // On initial sign-in
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000
          : 0; // Convert to milliseconds
        token.id = user.id;
      }

      if (
        typeof token.accessTokenExpires === "number" &&
        Date.now() >= token.accessTokenExpires
      ) {
        return await refreshAccessToken(token);
      }

      return token;
    },
  },
};

export async function refreshAccessToken(token: JWT) {
  try {
    spotifyApi.setAccessToken(token.accessToken as string);
    spotifyApi.setRefreshToken(token.refreshToken as string);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
    };
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth(authOptions);
