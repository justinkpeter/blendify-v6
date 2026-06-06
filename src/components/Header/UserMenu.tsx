import { signOut } from "next-auth/react";
import { Maximize2, Minimize2, LogOut } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import useFullscreen from "./useFullscreen";
import useOutsideClick from "./useOutsideClick";
import styles from "./UserMenu.module.scss";

export default function UserMenu({
  name,
  image,
}: {
  name: string;
  image?: string;
}) {
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useOutsideClick(menuRef, () => setMenuOpen(false));

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <div className={styles.trigger} onClick={() => setMenuOpen((p) => !p)}>
        {name && <span className={styles.userName}>{name.split(" ")[0]}</span>}
        {image ? (
          <Image
            src={image}
            alt={name ?? "User Avatar"}
            width={30}
            height={30}
            className={styles.userImage}
          />
        ) : (
          <div className={styles.userFallback}>{name?.[0].toUpperCase()}</div>
        )}
      </div>
      {isMenuOpen && (
        <div className={`${styles.menu} ${styles["menu--open"]}`}>
          <button onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            Toggle fullscreen
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("blendify_intro_seen");
              signOut().catch(console.error);
            }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
