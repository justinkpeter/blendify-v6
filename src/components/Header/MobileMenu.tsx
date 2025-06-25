import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";
import NavLinks from "./NavLinks";
import styles from "./Header.module.scss";

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPath: string;
}

export default function MobileMenu({
  isOpen,
  onToggle,
  currentPath,
}: MobileMenuProps) {
  return (
    <div className={styles.header__mobile}>
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <motion.div
              key="menu"
              initial={{ height: "0%" }}
              animate={{ height: "30%" }}
              exit={{ height: "0%" }}
              transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
              className={styles.mobileMenu}
            >
              <NavLinks currentPath={currentPath} onClick={onToggle} />
              <button
                onClick={() => signOut().catch(console.error)}
                className={styles.signOutButton}
              >
                <ArrowLeftEndOnRectangleIcon />
                sign out
              </button>
            </motion.div>

            <motion.div
              className={styles.mobileMenuOverlay}
              initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
              animate={{ backdropFilter: "blur(4px)", opacity: 1 }}
              exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
              onClick={onToggle}
            />
          </>
        )}
      </AnimatePresence>

      <button className={styles.hamburgerButton} onClick={onToggle}>
        <svg className={styles.hamburgerIcon}>
          <Bars3Icon />
        </svg>
      </button>
    </div>
  );
}
