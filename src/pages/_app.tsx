import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import AppBorder from "@/components/AppBorder";
import Header from "@/components/Header";
import "@/styles/globals.scss";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";

  return (
    <SessionProvider session={session}>
      <AppBorder>
        {!isLoginPage && <Header />}
        <Component {...pageProps} />
      </AppBorder>
    </SessionProvider>
  );
}
