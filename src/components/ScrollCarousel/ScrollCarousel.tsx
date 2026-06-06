import { ReactNode, useEffect, useRef } from "react";
import { AnyCarouselItem } from "./types";
import { useWheelScroll } from "./useWheelScroll";
import WheelPanel from "./WheelPanel";
import ImagePanel from "./ImagePanel";
import styles from "./ScrollCarousel.module.scss";
import { getCarouselItemName } from "./carouselUtils";

type ScrollCarouselProps<T extends AnyCarouselItem> = {
  items: T[];
  metaPanel?: ReactNode;
  onActiveItemChange?: (item: T) => void;
  className?: string;
};

export default function ScrollCarousel<T extends AnyCarouselItem>({
  items,
  metaPanel,
  onActiveItemChange,
  className = "",
}: ScrollCarouselProps<T>) {
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const { offset, activeIndex, containerRef, seekToIndex } = useWheelScroll(
    items?.length,
    onActiveItemChange
      ? (index) => onActiveItemChange(itemsRef.current[index])
      : undefined,
  );

  return (
    <div ref={containerRef} className={`${styles.carousel} ${className}`}>
      <div className={styles.carousel__stage}>
        <WheelPanel
          items={items}
          activeIndex={activeIndex}
          offset={offset}
          onSelect={seekToIndex}
          renderLabel={(item) => getCarouselItemName(item)}
        />
        <ImagePanel items={items} activeIndex={activeIndex} />
      </div>
      {metaPanel}
    </div>
  );
}
