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
        {loading ? (
          <AnimatePresence mode="wait">
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
          </AnimatePresence>
        ) : (
          items.map((item, index) => (
            <motion.div
              key={`item-${index}`}
              className={styles.carouselItem}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.83, 0, 0.17, 1],
                type: "spring",
                stiffness: 100,
              }}
            >
              {renderItem(item)}
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
