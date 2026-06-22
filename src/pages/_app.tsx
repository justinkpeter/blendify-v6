import Header from "@/components/Header/Header";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { useLoadingScreen } from "@/components/LoadingScreen/useLoadingScreen";
import { useState, useEffect } from "react";
import MobileOverlay from "@/components/MobileOverlay/MobileOverlay";
import Footer from "@/components/Footer/Footer";
import "@/styles/globals.scss";

function AppContent({
  Component,
  pageProps,
}: {
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
}) {
  const { showLoader, dataPromise, handleIntroComplete, status } =
    useLoadingScreen();

  const [isIntroComplete, setIsIntroComplete] = useState(() =>
    typeof window !== "undefined"
      ? !!sessionStorage.getItem("blendify_intro_seen")
      : false,
  );

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const introDone = !!sessionStorage.getItem("blendify_intro_seen");
    if (introDone || status !== "authenticated") {
      setIsVisible(true);
    }
  }, [status]);

  const handleComplete = () => {
    handleIntroComplete();
    setIsIntroComplete(true);
    setIsVisible(true);
  };

  return (
    <div className={`app ${isVisible ? "app--visible" : ""}`}>
      <MobileOverlay />
      {showLoader && dataPromise && (
        <LoadingScreen promise={dataPromise} onComplete={handleComplete} />
      )}
      {!showLoader && <Header isIntroComplete={isIntroComplete} />}
      <AnimatePresence mode="wait">
        {!showLoader && <Component {...pageProps} />}
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
