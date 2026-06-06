import { useEffect, useRef, useState, ReactNode } from "react";
import styles from "./SlidingButtonBar.module.scss";

type Tab = {
  label: ReactNode;
  value: string;
};

type SlidingButtonBarProps = {
  tabs: Tab[];
  activeTabIndex: number;
  onTabClick: (index: number) => void;
  className?: string;
  children?: ReactNode;
};

export default function SlidingButtonBar({
  tabs,
  activeTabIndex,
  onTabClick,
  className = "",
  children,
}: SlidingButtonBarProps) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillLeft, setPillLeft] = useState(0);
  const [pillWidth, setPillWidth] = useState(0);

  useEffect(() => {
    const activeTab = tabsRef.current[activeTabIndex];
    if (!activeTab) return;
    setPillLeft(activeTab.offsetLeft);
    setPillWidth(activeTab.clientWidth);
  }, [activeTabIndex, tabs]);

  return (
    <div className={`${styles.container} ${className}`}>
      <span
        className={styles.underline}
        style={{ left: pillLeft, width: pillWidth }}
      >
        <span className={styles.underlineInner} />
      </span>

      {tabs.map((tab, index) => (
        <button
          key={tab.value}
          ref={(el) => {
            tabsRef.current[index] = el;
          }}
          className={`${styles.tab} ${activeTabIndex === index ? styles.active : ""}`}
          onClick={() => onTabClick(index)}
        >
          {tab.label}
        </button>
      ))}

      {children && <div className={styles.extra}>{children}</div>}
    </div>
  );
}
