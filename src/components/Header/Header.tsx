import { useSession } from "next-auth/react";
import UserMenu from "./UserMenu";
import Link from "next/link";
import styles from "./Header.module.scss";

interface HeaderProps {
  isIntroComplete?: boolean;
}

export default function Header({ isIntroComplete = true }: HeaderProps) {
  const { data: session } = useSession();

  if (!session) return null;

  const { name, image } = session.user as {
    name: string;
    image?: string;
  };

  return (
    <header className={styles.header}>
      {/* Left — spacer*/}
      <div className={styles.header__left} />
      {/* Center — wordmark */}
      <div
        className={`${styles.header__center} ${isIntroComplete ? styles["header__center--visible"] : ""}`}
      >
        <Link href="/" className={styles.header__wordmark}>
          .blendify
        </Link>
      </div>
      {/* Right — user */}
      <div
        className={`${styles.header__right} ${isIntroComplete ? styles["header__right--visible"] : ""}`}
      >
        <UserMenu name={name} image={image} />
      </div>
    </header>
  );
}
