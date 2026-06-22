import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";
import spotifyApi from "@/lib/spotify";
import { AuthError } from "./authErrrors";

const REFRESH_BUFFER_MS = 60 * 1000; // Refresh 1 minute before expiry

const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: "user-top-read",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token!,
          refreshToken: account.refresh_token!,
          accessTokenExpires: account.expires_at
            ? account.expires_at * 1000
            : 0,
          id: user.id,
        };
      }

      if (Date.now() < token.accessTokenExpires - REFRESH_BUFFER_MS) {
        return token;
      }

      return refreshAccessToken(token);
    },
  },
};

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      error: undefined,
    };
  } catch (error: any) {
    console.error("Failed to refresh Spotify access token:", error);

    const isExpiredRefreshToken =
      error?.statusCode === 400 &&
      error?.message?.toLowerCase().includes("invalid_grant");

    return {
      ...token,
      error: isExpiredRefreshToken
        ? AuthError.RefreshTokenExpired
        : AuthError.RefreshAccessTokenError,
    };
  }
}

export default NextAuth(authOptions);
export { authOptions };
