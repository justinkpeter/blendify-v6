import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Page from "@/components/Page";
import "@/styles/globals.scss";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </SessionProvider>
  );
}
