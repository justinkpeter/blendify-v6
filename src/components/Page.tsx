import Head from "next/head";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { routes } from "@/routes";
import styles from "@/styles/components/page.module.scss";

interface PageProps {
  children: React.ReactNode;
}

export default function Page({ children }: PageProps) {
  const pathname = usePathname();
  const currentRoute = routes.find((route) => route.path === pathname);

  const title = currentRoute?.name
    ? `Blendify | ${currentRoute.name}`
    : "Blendify";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Personalized artist and music insights"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <motion.main
        className={styles.page}
        initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.main>
    </>
  );
}
