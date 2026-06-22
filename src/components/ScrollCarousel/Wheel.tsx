import { useRef, useEffect, useCallback, ReactNode, RefObject } from "react";
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
  scrollContainerRef: RefObject<HTMLDivElement>;
};

export default function Wheel({
  items,
  activeIndex,
  renderLabel,
  onSelect,
  scrollContainerRef,
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

  useEffect(() => {
    const container = scrollContainerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let snapTimeout: ReturnType<typeof setTimeout>;
    let lastDeltaY = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      track.scrollTop += e.deltaY;
      lastDeltaY = e.deltaY;

      clearTimeout(snapTimeout);
      snapTimeout = setTimeout(() => {
        if (Math.abs(lastDeltaY) > 2) return;
        const index = Math.round(track.scrollTop / ITEM_HEIGHT);
        const clamped = Math.max(0, Math.min(index, items.length - 1));
        track.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: "smooth" });
      }, 350);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      clearTimeout(snapTimeout);
    };
  }, [scrollContainerRef, items.length]);

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
          const distance = Math.abs(index - activeIndex);
          const opacity = Math.max(0, 1 - distance * 0.3);
          const isActive = index === activeIndex;

          return (
            <div
              key={getCarouselItemId(item)}
              className={`${styles.wheel__item} ${
                isActive ? styles["wheel__item--active"] : ""
              }`}
              style={{ opacity }}
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
