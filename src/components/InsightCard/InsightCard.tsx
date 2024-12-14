import React from "react";
import styles from "./InsightCard.module.scss";

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

export default function InsightCard({ icon, title, value }: InsightCardProps) {
  return (
    <div className={styles.insightCard}>
      <div className={styles.insightCard__icon}>{icon}</div>
      <div>
        <div className={styles.insightCard__title}>{title}</div>
        <div className={styles.insightCard__value}>{value}</div>
      </div>
    </div>
  );
}
