import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Carousel.module.scss";

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  loading?: boolean;
}

export default function Carousel<T>({
  items,
  renderItem,
  loading = false,
}: CarouselProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle vertical scrolling to scroll horizontally
  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += event.deltaY;
    }
  };

  return (
    <div className={styles.carouselContainer}>
      <motion.div
        ref={containerRef}
        className={styles.carousel}
        onWheel={handleScroll}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className={styles.loading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              Loading...
            </motion.div>
          ) : (
            items.map((item, index) => (
              <motion.div
                key={`item-${index}`}
                className={styles.carouselItem}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderItem(item)}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
