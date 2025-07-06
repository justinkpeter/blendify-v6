import styles from "./Badge.module.scss";

export default function Badge({ children }: { children?: React.ReactNode }) {
  return <div className={styles.badge}>{children}</div>;
}
