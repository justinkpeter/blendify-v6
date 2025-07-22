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
      <div className="app">
        <Header />
        <AnimatePresence mode="wait">
          <AudioPlayerProvider>
            <Component {...pageProps} />
          </AudioPlayerProvider>
        </AnimatePresence>
      </div>
    </SessionProvider>
  );
}
