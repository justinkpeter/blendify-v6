import Link from "next/link";
import { routes } from "@/routes";
import styles from "./Header.module.scss";

interface NavLinksProps {
  currentPath: string;
  onClick?: () => void;
}

export default function NavLinks({ currentPath, onClick }: NavLinksProps) {
  return (
    <>
      {routes.map(({ name, path }) => (
        <Link
          key={name}
          href={path}
          className={`${styles.navLink} ${
            currentPath === path ? styles.active : ""
          }`}
          onClick={onClick}
        >
          {name}
        </Link>
      ))}
    </>
  );
}
