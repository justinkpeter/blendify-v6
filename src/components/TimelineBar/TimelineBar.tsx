import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./TimelineBar.module.scss";

const PROXIMITY_RANGE = 4;

interface TimelineBarProps {
  /* progress as decimeal (0 to 1) */
  progress: number;
  /* callback function on every new position */
  handleScrub: (position: number) => void; // Called with new position
}

export default function TimelineBar({
  progress,
  handleScrub,
}: TimelineBarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const itemCount = 15;

  const activeIndex = Math.ceil(progress * itemCount);

  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    const proximity = Math.abs(hoveredIndex - index);
    return proximity <= PROXIMITY_RANGE
      ? 1 + (PROXIMITY_RANGE - proximity) * 0.15
      : 1;
  };

  const handleMouseDown = (index: number) => {
    setIsScrubbing(true);
    handleScrub(index / (itemCount - 1));
  };

  const handleMouseUp = () => {
    setIsScrubbing(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isScrubbing) return;

    const rect = document
      .querySelector(`.${styles["timeline-bar"]}`)
      ?.getBoundingClientRect();
    if (!rect) return;

    const relativeX = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const index = Math.floor((relativeX / rect.width) * (itemCount - 1));

    handleScrub(index / (itemCount - 1));
  };

  useEffect(() => {
    if (isScrubbing) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isScrubbing]);

  return (
    <div className={styles["timeline-bar"]}>
      {Array.from({ length: itemCount }).map((_, index) => {
        const isElapsed = index < activeIndex;

        return (
          <motion.button
            key={index}
            onClick={() => handleScrub(index / (itemCount - 1))}
            onMouseDown={() => handleMouseDown(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`${styles["timeline-bar__button"]} ${
              isElapsed ? styles["elapsed"] : ""
            }`}
          >
            <motion.div
              className={styles["timeline-bar__pos"]}
              initial={{ scale: 1 }}
              animate={{ scale: getScale(index) }}
              transition={{
                type: "easeOut",
                duration: 0.1,
              }}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
