import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./TimelineBar.module.scss";

const ITEM_COUNT = 20;
const PROXIMITY_RANGE = 4;

interface TimelineBarProps {
  progress: number;
  handleScrub: (position: number) => void;
}

export default function TimelineBar({
  progress,
  handleScrub,
}: TimelineBarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIndex = Math.ceil(progress * ITEM_COUNT);

  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    const proximity = Math.abs(hoveredIndex - index);
    return proximity <= PROXIMITY_RANGE
      ? 1 + (PROXIMITY_RANGE - proximity) * 0.15
      : 1;
  };

  const getIndexFromX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const relativeX = Math.min(Math.max(0, clientX - rect.left), rect.width);
    return Math.round((relativeX / rect.width) * (ITEM_COUNT - 1));
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isScrubbing) return;
      const index = getIndexFromX(e.clientX);
      if (index === null) return;
      handleScrub(index / (ITEM_COUNT - 1));
    },
    [isScrubbing, handleScrub, getIndexFromX],
  );

  const handleMouseUp = useCallback(() => {
    setIsScrubbing(false);
    setHoveredIndex(null);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={styles["timeline-bar"]}
      onMouseMove={(e) => {
        const index = getIndexFromX(e.clientX);
        if (index === null) return;
        setHoveredIndex(index);
      }}
      onMouseDown={(e) => {
        const index = getIndexFromX(e.clientX);
        if (index === null) return;
        setIsScrubbing(true);
        handleScrub(index / (ITEM_COUNT - 1));
      }}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {Array.from({ length: ITEM_COUNT }).map((_, index) => (
        <div
          key={index}
          style={{ "--scale": getScale(index) } as React.CSSProperties}
          className={`${styles["timeline-bar__tick"]} ${
            index < activeIndex ? styles["elapsed"] : ""
          }`}
        />
      ))}
    </div>
  );
}
