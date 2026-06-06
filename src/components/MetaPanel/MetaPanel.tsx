import { ReactNode } from "react";
import styles from "./MetaPanel.module.scss";

interface MetaPanelProps {
  isOpen: boolean;
  children?: ReactNode;
}

export default function MetaPanel({ isOpen, children }: MetaPanelProps) {
  return (
    <aside className={`${styles.panel} ${isOpen ? styles["panel--open"] : ""}`}>
      <div className={styles.panel__inner}>{children}</div>
    </aside>
  );
}

export function MetaRow({
  label,
  value,
  children,
  hideBottomBorder,
  padding,
  height,
}: {
  label?: ReactNode;
  value?: string;
  children?: ReactNode;
  hideBottomBorder?: boolean;
  padding?: number | undefined;
  height?: number | undefined;
}) {
  return (
    <li
      className={`${styles.panel__row} ${hideBottomBorder ? styles["panel__row--no-border"] : ""}`}
      style={{
        padding: padding !== undefined ? `${padding}px 0px` : undefined,
        height: height !== undefined ? `${height}px` : undefined,
      }}
    >
      {label && (
        <span
          className={styles.panel__label}
          title={typeof label === "string" ? label : undefined}
        >
          {label}
        </span>
      )}
      {value && (
        <span className={styles.panel__value} title={value}>
          {value}
        </span>
      )}
      {children}
    </li>
  );
}

export function ExplicitBadge({ isExplicit }: { isExplicit?: boolean }) {
  return (
    <span
      className={`${styles.explicitBadge} ${isExplicit ? "" : styles.hiddenExplicitBadge}`}
    >
      E
    </span>
  );
}
