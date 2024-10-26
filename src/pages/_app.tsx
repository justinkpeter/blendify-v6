import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import AppBorder from "@/components/AppBorder";
import Header from "@/components/Header";
import Page from "@/components/Page";
import "@/styles/globals.scss";
import { AnimatePresence, motion } from "framer-motion";

const pageTransitionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

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
        <AnimatePresence mode="wait">
          <motion.div
            className={"page-container"}
            key={router.route}
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Page>
              <Component {...pageProps} />
            </Page>
          </motion.div>
        </AnimatePresence>
      </AppBorder>
    </SessionProvider>
  );
}
