import Headphones from "@/components/Headphones";
import Link from "next/link";
import styles from "@/styles/pages/home.module.scss";
import Page from "@/components/Page";
import { routes } from "@/routes";

export default function Home() {
  return (
    <Page className={styles.homePage}>
      <div className={styles.homePage__content}>
        <div>[ discover your sound ]</div>
        <div className={styles.blendify}>.blendify </div>
        <div className={styles.headphones}>
          <Headphones />
        </div>
      </div>
      <div className={styles.homePageLinks}>
        {routes.map((route) => (
          <Link key={route.path} href={route.path}>
            {route.name}
          </Link>
        ))}
      </div>
    </Page>
  );
}
