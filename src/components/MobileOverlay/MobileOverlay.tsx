import Toast from "@/components/Toast/Toast";
import { useToast } from "@/components/Toast/useToast";
import styles from "./MobileOverlay.module.scss";

export default function MobileOverlay() {
  const { toasts, show } = useToast();

  return (
    <div className={styles.overlay}>
      <p className={styles.overlay__message}>
        Blendify was built for the big screen. Please use a bigger window.
      </p>
      <div className={styles["overlay__button-group"]}>
        <button
          className={styles.overlay__button}
          onClick={async () => {
            if (navigator?.share) {
              await navigator.share({
                title: "Blendify",
                url: window.location.href,
              });
            }
          }}
        >
          Send to my computer
        </button>
        <button
          className={styles.overlay__button}
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            show("Site link copied");
          }}
        >
          Copy link
        </button>
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}
