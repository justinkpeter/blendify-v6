import styles from "@/styles/pages/home.module.scss";
import Headphones from "@/components/Headphones";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  return (
    <AnimatePresence mode="wait">
      <motion.main
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={styles.home}
      >
        <span className={styles.desc}>[ discover your sound ]</span>
        <h1 className={styles.blendify}>blendify</h1>
        <div className={styles.headphones}>
          <Headphones />
        </div>
        <div className={styles.links}>
          <Link href={"/tracks"} className={styles.button} draggable={false}>
            {" "}
            Tracks
          </Link>
          <Link href={"/artists"} className={styles.button} draggable={false}>
            Artists
          </Link>
          <Link href={"/genres"} className={styles.button} draggable={false}>
            {" "}
            Genres
          </Link>
          <Link
            href={"/taste-profile"}
            className={styles.button}
            draggable={false}
          >
            Taste Profile
          </Link>
        </div>
        <div>
          <p>Your soundtrack is a story worth exploring anytime.</p>
        </div>
      </motion.main>
    </AnimatePresence>
  );
}
