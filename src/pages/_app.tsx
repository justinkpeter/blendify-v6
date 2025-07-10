import Header from "@/components/Header/Header";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "@/styles/globals.scss";
import { AnimatePresence } from "framer-motion";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Header />
      <AnimatePresence mode="wait">
        <Component {...pageProps} />
      </AnimatePresence>
    </SessionProvider>
  );
}
