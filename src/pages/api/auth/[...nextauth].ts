import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";
import { LOGIN_URL } from "@/lib/spotify";

declare module "next-auth" {
  interface Session {
    accessToken?: JWT["accessToken"];
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
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expires_at = account.expires_at;
        token.id = user?.id;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
