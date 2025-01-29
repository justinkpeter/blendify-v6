import styles from "@/styles/pages/home.module.scss";
import Headphones from "@/components/Headphones";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.home}>
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
    </main>
  );
}
