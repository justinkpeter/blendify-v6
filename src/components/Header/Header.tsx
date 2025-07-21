import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import styles from "./Header.module.scss";

export default function Header() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentPath = usePathname();

  if (!session) return null;

  const { name, image } = session.user as {
    name: string;
    image?: string;
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__left}>
        <Link href="/">.blendify</Link>
      </div>

      <nav className={styles.header__center}>
        <NavLinks currentPath={currentPath} />
      </nav>

      <div className={styles.header__right}>
        {name}
        <UserMenu name={name} image={image} />
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onToggle={() => setMobileMenuOpen((prev) => !prev)}
        currentPath={currentPath}
      />
    </header>
  );
}
