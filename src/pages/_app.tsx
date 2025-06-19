import Page from "@/components/Page";
import Header from "@/components/Header";
import { AnimatePresence } from "framer-motion";
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
      <AnimatePresence mode="wait">
        <Page>
          <Component {...pageProps} />
        </Page>
      </AnimatePresence>
    </SessionProvider>
  );
}
