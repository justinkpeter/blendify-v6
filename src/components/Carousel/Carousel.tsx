import React, { useRef } from "react";
import styles from "./Carousel.module.scss";

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export default function Carousel<T>({ items, renderItem }: CarouselProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle vertical scrolling to scroll horizontally
  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += event.deltaY;
    }
  };

  return (
    <div className={styles.carouselContainer}>
      <div
        ref={containerRef}
        className={styles.carousel}
        onWheel={handleScroll}
      >
        {items.map((item, index) => (
          <div key={index} className={styles.carouselItem}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
