import { useEffect, useRef, useState } from "react";

export default function useIndicatorPosition(activeIndex: number | null) {
  const [indicatorTop, setIndicatorTop] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const updateIndicatorPosition = () => {
      if (activeIndex !== null && listRef.current) {
        const listItem = listRef.current.children[activeIndex] as HTMLElement;
        if (listItem) {
          setIndicatorTop(listItem.offsetTop);
        }
      }
    };

    // Setup ResizeObserver to monitor size changes dynamically
    const resizeObserver = new ResizeObserver(updateIndicatorPosition);
    if (listRef.current) {
      resizeObserver.observe(listRef.current);
    }

    window.addEventListener("resize", updateIndicatorPosition);
    updateIndicatorPosition(); // Initial calculation on mount

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateIndicatorPosition);
    };
  }, [activeIndex]);

  return { indicatorTop, listRef };
}
