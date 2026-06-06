import Header from "@/components/Header/Header";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { useLoadingScreen } from "@/components/LoadingScreen/useLoadingScreen";
import { useState } from "react";
import "@/styles/globals.scss";
import Footer from "@/components/Footer/Footer";

function AppContent({
  Component,
  pageProps,
}: {
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
  router?: any;
}) {
  const { showLoader, dataPromise, handleIntroComplete } = useLoadingScreen();
  const [isIntroComplete, setIsIntroComplete] = useState(() =>
    typeof window !== "undefined"
      ? !!sessionStorage.getItem("blendify_intro_seen")
      : false,
  );

  const handleComplete = () => {
    handleIntroComplete();
    setIsIntroComplete(true);
  };

  return (
    <div className="app">
      {showLoader && dataPromise && (
        <LoadingScreen promise={dataPromise} onComplete={handleComplete} />
      )}
      {!showLoader && <Header isIntroComplete={isIntroComplete} />}
      <AnimatePresence mode="wait">
        <Component {...pageProps} />
      </AnimatePresence>
      {!showLoader && <Footer />}
    </div>
  );
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <AudioPlayerProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </AudioPlayerProvider>
    </SessionProvider>
  );
}
