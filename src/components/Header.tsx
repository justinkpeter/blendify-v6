import styles from "@/styles/components/Header.module.scss";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/solid";

export default function Header() {
  const { data: session } = useSession();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isFullScreen, setFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setFullScreen(!isFullScreen);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  if (!session) return null;

  const user = session.user as { name: string; image?: string };

  return (
    <header className={styles.header}>
      <div className={styles.header__left}>
        <Link href="/">blendify</Link>
      </div>
      <div className={styles.header__right}>
        {user.name}
        <div className={styles.userMenu}>
          {user.image && (
            <Image
              src={user.image}
              alt={user.name}
              width={24}
              height={24}
              onClick={() => setToggleMenu(!toggleMenu)}
              className={styles.userImage}
            />
          )}
          <div className={`${styles.menu} ${toggleMenu ? styles.active : ""}`}>
            {toggleMenu && (
              <>
                <button onClick={toggleFullScreen}>
                  {isFullScreen ? (
                    <ArrowsPointingInIcon />
                  ) : (
                    <ArrowsPointingOutIcon />
                  )}
                  toggle fullscreen
                </button>
                <button onClick={() => signOut().catch(console.error)}>
                  <ArrowLeftEndOnRectangleIcon />
                  sign out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
