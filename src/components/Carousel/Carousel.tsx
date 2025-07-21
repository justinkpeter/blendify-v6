import React, {
  useRef,
  useState,
  useEffect,
  PointerEvent,
  ReactNode,
} from "react";
import styles from "./Carousel.module.scss";

type CarouselProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => JSX.Element | ReactNode;
};

export default function Carousel<T>({ items, renderItem }: CarouselProps<T>) {
  const scrollRef = useRef<HTMLUListElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const scrollStartX = useRef(0);
  const scrollStartLeft = useRef(0);

  // 🖱️ Enable horizontal scroll with vertical wheel
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        scrollEl.scrollLeft += e.deltaY;
      }
    };

    scrollEl.addEventListener("wheel", handleWheel, { passive: false });
    return () => scrollEl.removeEventListener("wheel", handleWheel);
  }, []);

  // 🌀 Drag-to-scroll logic
  const handlePointerDown = (e: PointerEvent<HTMLUListElement>) => {
    scrollRef.current?.setPointerCapture(e.pointerId);
    setIsDragging(true);
    scrollStartX.current = e.clientX;
    scrollStartLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const handlePointerMove = (e: PointerEvent<HTMLUListElement>) => {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.clientX - scrollStartX.current;
    scrollRef.current.scrollLeft = scrollStartLeft.current - dx;
  };

  const handlePointerUp = (e: PointerEvent<HTMLUListElement>) => {
    scrollRef.current?.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  return (
    <div className={styles.carouselContainer}>
      <ul
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={styles.carousel}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {items.map((item, index) => (
          <li key={index}>{renderItem(item, index)}</li>
        ))}
      </ul>
    </div>
  );
}
