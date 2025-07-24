import Head from "next/head";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { routes } from "@/routes";
import clsx from "clsx";
import styles from "@/styles/components/page.module.scss";

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

export default function Page({ children, className }: PageProps) {
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
        className={clsx(styles.page, className)}
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        key={title}
      >
        {children}
      </motion.main>
    </>
  );
}
