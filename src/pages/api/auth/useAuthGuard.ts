"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

/**
 * Automatically redirects to sign-in if the refresh token has expired.
 */
export function useAuthGuard() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session?.error) return;

    if (session.error === "RefreshTokenExpired") {
      console.warn("Spotify refresh token expired. Redirecting to sign-in.");
      signIn("spotify");
      return;
    }

    if (session.error === "RefreshAccessTokenError") {
      console.warn(
        "Spotify access token refresh failed. Redirecting to sign-in.",
      );
      signIn("spotify");
    }
  }, [session?.error]);

  return { session, status, isError: !!session?.error };
}
