import styles from "./LoadingSpinner.module.scss";

export default function LoadingSpinner() {
  return (
    <div className={styles.container}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div className={styles.line} key={i}></div>
      ))}
    </div>
  );
}
