import styles from "./Toast.module.scss";

export type ToastItem = {
  id: number;
  message: string;
  image?: string;
  exiting: boolean;
};

export default function Toasts({ toasts }: { toasts: ToastItem[] }) {
  const PEEK = 12;

  return (
    <div className={styles.stack}>
      {toasts.map((toast, index) => {
        const distanceFromNewest = toasts.length - 1 - index;
        const scale = Math.max(0.88, 1 - distanceFromNewest * 0.06);
        // const opacity = Math.max(0.4, 1 - distanceFromNewest * 0.2);
        const bottomOffset = distanceFromNewest * PEEK;

        return (
          <div
            key={toast.id}
            className={`${styles.toast} ${toast.exiting ? styles["toast--exiting"] : ""}`}
            style={{
              transform: `translateX(-50%) scale(${scale})`,
              //   opacity,
              zIndex: toasts.length - distanceFromNewest,
              bottom: `${bottomOffset}px`,
            }}
          >
            {toast.image && (
              <div className={styles.toast__preview}>
                <img src={toast.image} alt="" />
              </div>
            )}
            <span className={styles.toast__message}>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
