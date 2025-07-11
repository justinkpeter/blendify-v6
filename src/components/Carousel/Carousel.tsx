import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
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
  const trackRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [thumbWidth, setThumbWidth] = useState(1);
  const [thumbLeft, setThumbLeft] = useState(0);

  const scrollStartX = useRef(0);
  const scrollStartLeft = useRef(0);
  const scrollWidth = useRef(1);
  const clientWidth = useRef(1);
  const trackWidth = useRef(1);

  // 🧠 Recalculate dimensions
  const updateDimensions = useCallback(() => {
    if (!scrollRef.current || !trackRef.current) return;

    const scrollEl = scrollRef.current;
    const trackEl = trackRef.current;

    scrollWidth.current = scrollEl.scrollWidth;
    clientWidth.current = scrollEl.clientWidth;
    trackWidth.current = trackEl.clientWidth;

    const ratio = clientWidth.current / scrollWidth.current;
    setThumbWidth(trackWidth.current * ratio);
    setThumbLeft(
      (scrollEl.scrollLeft / scrollWidth.current) * trackWidth.current
    );
  }, []);

  // 🧱 Prevent layout jank
  useLayoutEffect(() => {
    updateDimensions();
  }, [updateDimensions]);

  useEffect(() => {
    const resizeHandler = () => updateDimensions();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, [updateDimensions]);

  // 🌀 Scroll handling (throttled)
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !trackRef.current) return;
    const scrollEl = scrollRef.current;
    const scrollRatio = scrollEl.scrollLeft / scrollWidth.current;
    setThumbLeft(scrollRatio * trackWidth.current);
  }, []);

  // 🖱 Carousel dragging
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

  // 🖱 Thumb dragging
  const handleThumbDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current || !trackRef.current) return;

    const startX = e.clientX;
    const startScrollLeft = scrollRef.current.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const newScrollLeft =
        startScrollLeft + (dx * scrollWidth.current) / trackWidth.current;
      scrollRef.current!.scrollLeft = newScrollLeft;
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className={styles.carouselContainer}>
      <ul
        ref={scrollRef}
        onScroll={handleScroll}
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

      {items.length > 3 && (
        <div ref={trackRef} className={styles.scrollbarTrack}>
          <div
            className={styles.scrollbarThumb}
            style={{
              width: `${thumbWidth}px`,
              left: `${thumbLeft}px`,
            }}
            onMouseDown={handleThumbDrag}
          />
        </div>
      )}
    </div>
  );
}
