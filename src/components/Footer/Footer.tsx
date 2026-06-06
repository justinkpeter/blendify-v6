import { useEffect, useState } from "react";
import Toast from "@/components/Toast/Toast";
import { useToast } from "@/components/Toast/useToast";
import styles from "./Footer.module.scss";

export default function Footer() {
  const year = new Date().getFullYear();
  const { toasts, show } = useToast();
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    setHasSeenIntro(!!sessionStorage.getItem("blendify_intro_seen"));
  }, []);

  if (!hasSeenIntro) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    show("Site link copied", "/og-image.jpg");
  };

  return (
    <footer className={styles.footer}>
      <span className={styles.footer__copy}>Justin Peter © {year}</span>
      <button className={styles.footer__share} onClick={handleShare}>
        Share site
      </button>
      <Toast toasts={toasts} />
    </footer>
  );
}
