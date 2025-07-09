import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import styles from "./Carousel.module.scss";

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.07,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.1,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export default function Carousel<T>({ items, renderItem }: CarouselProps<T>) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const updateWidth = () => {
      setWidth(el.scrollWidth - el.offsetWidth);
    };

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(el);

    updateWidth();

    return () => {
      resizeObserver.disconnect();
    };
  }, [items]);

  return (
    <motion.div
      className={styles.carouselWrapper}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className={styles.carousel}
        ref={carouselRef}
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
        dragTransition={{
          power: 0.8,
          timeConstant: 400,
          bounceStiffness: 80,
          bounceDamping: 12,
        }}
        dragElastic={0.1}
        whileTap={{ cursor: "grabbing" }}
        whileDrag={{ cursor: "grabbing" }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={styles.carousel__item}
            variants={itemVariants}
            dragListener={false}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
