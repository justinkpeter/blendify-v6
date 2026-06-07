import Header from "@/components/Header/Header";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { useLoadingScreen } from "@/components/LoadingScreen/useLoadingScreen";
import { useEffect, useState } from "react";
import "@/styles/globals.scss";
import Footer from "@/components/Footer/Footer";

function AppContent({
  Component,
  pageProps,
}: {
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
}) {
  const { showLoader, dataPromise, handleIntroComplete } = useLoadingScreen();
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const seen = !!sessionStorage.getItem("blendify_intro_seen");
    setIsIntroComplete(seen);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });
  }, []);

  const handleComplete = () => {
    handleIntroComplete();
    setIsIntroComplete(true);
    setIsVisible(true);
  };

  return (
    <div className={`app ${isVisible ? "app--visible" : ""}`}>
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
