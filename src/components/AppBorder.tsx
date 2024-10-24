import React from "react";
import styles from "@/styles/components/AppBorder.module.scss";

export default function AppBorder({ children }: { children: React.ReactNode }) {
  return <div className={styles.appBorder}>{children}</div>;
}
