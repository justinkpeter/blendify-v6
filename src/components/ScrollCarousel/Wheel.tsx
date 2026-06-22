import { useRef, useEffect, useCallback, ReactNode } from "react";
import { AnyCarouselItem } from "./types";
import { getCarouselItemId } from "./carouselUtils";
import styles from "./Wheel.module.scss";

const ITEM_HEIGHT = 40;
const VISIBLE_COUNT = 10;

type WheelProps = {
  items: AnyCarouselItem[];
  activeIndex: number;
  renderLabel: (item: AnyCarouselItem) => ReactNode;
  onSelect: (index: number) => void;
};

export default function Wheel({
  items,
  activeIndex,
  renderLabel,
  onSelect,
}: WheelProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isInternalScroll = useRef(false);

  useEffect(() => {
    if (isInternalScroll.current) {
      isInternalScroll.current = false;
      return;
    }
    trackRef.current?.scrollTo({
      top: activeIndex * ITEM_HEIGHT,
      behavior: "smooth",
    });
  }, [activeIndex]);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    if (clamped !== activeIndex) {
      isInternalScroll.current = true;
      onSelect(clamped);
    }
  }, [activeIndex, items.length, onSelect]);

  const halfVisible = Math.floor(VISIBLE_COUNT / 2);

  return (
    <div className={styles.wheel}>
      <div
        ref={trackRef}
        className={styles.wheel__track}
        onScroll={handleScroll}
      >
        <div
          className={styles.wheel__spacer}
          style={{ height: halfVisible * ITEM_HEIGHT }}
        />
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={getCarouselItemId(item)}
              className={`${styles.wheel__item} ${
                isActive ? styles["wheel__item--active"] : ""
              }`}
              onClick={() => onSelect(index)}
            >
              {renderLabel(item)}
            </div>
          );
        })}
        <div
          className={styles.wheel__spacer}
          style={{ height: halfVisible * ITEM_HEIGHT }}
        />
      </div>
    </div>
  );
}
