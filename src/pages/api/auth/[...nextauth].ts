import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";
import spotifyApi from "@/lib/spotify";

const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: "user-top-read",
          show_dialog: true,
        },
      },
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
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      spotifyApi.setAccessToken(token.accessToken);
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

      if (Date.now() < token.accessTokenExpires) {
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
    };
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export default NextAuth(authOptions);
