import { useEffect, useRef, useState, ReactNode } from "react";
import styles from "./SlidingButtonBar.module.scss";

type Tab = {
  label: string;
  value: string;
};

type SlidingTabBarProps = {
  tabs: Tab[];
  activeTabIndex: number;
  onTabClick: (index: number) => void;
  className?: string;
  children?: ReactNode;
};

export default function SlidingTabBar({
  tabs,
  activeTabIndex,
  onTabClick,
  className = "",
  children,
}: SlidingTabBarProps) {
  const tabsRef = useRef<(HTMLElement | null)[]>([]);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  useEffect(() => {
    const currentTab = tabsRef.current[activeTabIndex];
    if (currentTab) {
      setTabUnderlineLeft(currentTab.offsetLeft);
      setTabUnderlineWidth(currentTab.clientWidth);
    }
  }, [activeTabIndex, tabs]);

  return (
    <div className={`${styles.container} ${className}`}>
      <span
        className={styles.underline}
        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
      >
        <span className={styles.underlineInner} />
      </span>
      {tabs.map((tab, index) => (
        <button
          key={tab.value}
          ref={(el) => {
            tabsRef.current[index] = el;
          }}
          className={`${styles.tab} ${
            activeTabIndex === index ? styles.active : ""
          }`}
          onClick={() => onTabClick(index)}
        >
          {tab.label}
        </button>
      ))}
      {children && <div className={styles.extra}>{children}</div>}
    </div>
  );
}
