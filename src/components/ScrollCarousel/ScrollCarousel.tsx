import { ReactNode, useState, useCallback, useEffect, useRef } from "react";
import { AnyCarouselItem } from "./types";
import Wheel from "./Wheel";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const onActiveItemChangeRef = useRef(onActiveItemChange);

  useEffect(() => {
    onActiveItemChangeRef.current = onActiveItemChange;
  }, [onActiveItemChange]);

  const handleSelect = useCallback(
    (index: number) => {
      setActiveIndex(index);
      onActiveItemChangeRef.current?.(items[index]);
    },
    [items],
  );

  return (
    <div ref={carouselRef} className={`${styles.carousel} ${className}`}>
      <div className={styles.carousel__stage}>
        <Wheel
          items={items}
          activeIndex={activeIndex}
          onSelect={handleSelect}
          scrollContainerRef={carouselRef}
          renderLabel={(item) => getCarouselItemName(item)}
        />
        <ImagePanel items={items} activeIndex={activeIndex} />
      </div>
      {metaPanel}
    </div>
  );
}
