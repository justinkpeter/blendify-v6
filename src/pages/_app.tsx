import Header from "@/components/Header/Header";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "@/styles/globals.scss";
import { AnimatePresence } from "framer-motion";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Header />
      <AnimatePresence mode="wait">
        <AudioPlayerProvider>
          <Component {...pageProps} />
        </AudioPlayerProvider>
      </AnimatePresence>
    </SessionProvider>
  );
}
