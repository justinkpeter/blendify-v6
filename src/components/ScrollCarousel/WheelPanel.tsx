import { ReactNode } from "react";
import { AnyCarouselItem, CarouselTrackItem } from "./types";
import { ITEM_HEIGHT } from "./useWheelScroll";
import styles from "./ScrollCarousel.module.scss";
import { getCarouselItemId } from "./carouselUtils";

const VISIBLE_COUNT = 7;

type WheelPanelProps = {
  items: AnyCarouselItem[];
  activeIndex: number;
  offset: number;
  renderLabel: (item: AnyCarouselItem) => ReactNode;
  onSelect: (index: number) => void;
};

export default function WheelPanel({
  items,
  activeIndex,
  offset,
  renderLabel,
  onSelect,
}: WheelPanelProps) {
  const halfVisible = Math.floor(VISIBLE_COUNT / 2);

  // Normalize offset to sub-item range so track never escapes the container
  const trackTranslateY = -offset + halfVisible * ITEM_HEIGHT;

  return (
    <div className={styles.wheel}>
      <div
        className={styles.wheel__track}
        style={{ transform: `translateY(${trackTranslateY}px)` }}
      >
        {items?.map((item, index) => {
          const distance = Math.abs(index - activeIndex);
          const opacity = Math.max(0, 1 - distance * 0.3);
          const isActive = index === activeIndex;

          return (
            <div
              key={getCarouselItemId(item)}
              className={`${styles.wheel__item} ${isActive ? styles["wheel__item--active"] : ""}`}
              style={{ opacity }}
              onClick={() => onSelect(index)}
            >
              {renderLabel(item)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
