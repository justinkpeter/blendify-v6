import { useRef, useState, useEffect, ReactNode } from "react";
import styles from "./Marquee.module.scss";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function Marquee({
  children,
  className = "",
  onClick,
}: MarqueeProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;
    setOverflows(inner.scrollWidth > container.offsetWidth);
  }, [children]);

  return (
    <span
      ref={containerRef}
      className={`${styles.marquee} ${overflows ? styles["marquee--overflows"] : ""} ${className}`}
      onClick={onClick}
    >
      <span ref={innerRef} className={styles.marquee__inner}>
        {children}
        {overflows && <>&nbsp;&nbsp;&nbsp;&nbsp;{children}</>}
      </span>
    </span>
  );
}
