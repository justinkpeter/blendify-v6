import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import Image from "next/image";
import useFullscreen from "./useFullscreen";
import useOutsideClick from "./useOutsideClick";
import styles from "./Header.module.scss";

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
      {image ? (
        <Image
          src={image}
          alt={name ?? "User Avatar"}
          width={30}
          height={30}
          onClick={() => setMenuOpen((p) => !p)}
          className={styles.userImage}
        />
      ) : (
        <div
          className={styles.userFallback}
          onClick={() => setMenuOpen((p) => !p)}
        >
          {name && name[0].toUpperCase()}
        </div>
      )}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div
            key="user-menu"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={styles.menu}
          >
            <button onClick={toggleFullscreen}>
              {isFullscreen ? (
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
