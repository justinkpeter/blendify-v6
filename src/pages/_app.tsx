import Page from "@/components/Page";
import Header from "@/components/Header/Header";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "@/styles/globals.scss";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Header />
      <Page>
        <Component {...pageProps} />
      </Page>
    </SessionProvider>
  );
}
