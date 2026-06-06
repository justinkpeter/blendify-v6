import { useCallback, useEffect, useRef, useState } from "react";

export const ITEM_HEIGHT = 40;
const SNAP_DURATION = 600;
const SCROLL_MULTIPLIER = 0.5;
const MOMENTUM_DECAY = 120;
const IDLE_THRESHOLD = 80;

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function easeInOutExpo(t: number): number {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;
}

export function useWheelScroll(
  itemCount: number,
  onIndexChange?: (index: number) => void,
) {
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastEventTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastActiveIndex = useRef(-1);

  const maxOffset = (itemCount - 1) * ITEM_HEIGHT;

  const clampOffset = useCallback(
    (value: number) => Math.max(0, Math.min(maxOffset, value)),
    [maxOffset],
  );

  const cancelRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const notifyIfChanged = useCallback(
    (currentOffset: number) => {
      if (!onIndexChange) return;
      const index = Math.min(
        itemCount - 1,
        Math.max(0, Math.round(currentOffset / ITEM_HEIGHT)),
      );
      if (index !== lastActiveIndex.current) {
        lastActiveIndex.current = index;
        onIndexChange(index);
      }
    },
    [itemCount, onIndexChange],
  );

  const snapToNearest = useCallback(
    (fromOffset: number, momentum = 0) => {
      const targetOffset = clampOffset(
        Math.round((fromOffset + momentum) / ITEM_HEIGHT) * ITEM_HEIGHT,
      );
      const startOffset = fromOffset;
      const startTime = performance.now();

      const animate = (now: number) => {
        const progress = Math.min((now - startTime) / SNAP_DURATION, 1);
        const current =
          startOffset + (targetOffset - startOffset) * easeOutExpo(progress);

        offsetRef.current = current;
        setOffset(current);
        notifyIfChanged(current);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          offsetRef.current = targetOffset;
          setOffset(targetOffset);
          notifyIfChanged(targetOffset);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    },
    [clampOffset, notifyIfChanged],
  );

  // ── Wheel ─────────────────────────────────────────────────────
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      cancelRaf();

      const now = performance.now();
      velocityRef.current =
        (e.deltaY / Math.max(1, now - lastEventTimeRef.current)) * 16;
      lastEventTimeRef.current = now;

      const next = clampOffset(
        offsetRef.current + e.deltaY * SCROLL_MULTIPLIER,
      );
      offsetRef.current = next;
      setOffset(next);
      notifyIfChanged(next);

      const awaitIdle = () => {
        if (performance.now() - lastEventTimeRef.current < IDLE_THRESHOLD) {
          rafRef.current = requestAnimationFrame(awaitIdle);
          return;
        }
        snapToNearest(offsetRef.current, velocityRef.current * MOMENTUM_DECAY);
      };

      rafRef.current = requestAnimationFrame(awaitIdle);
    },
    [cancelRaf, clampOffset, notifyIfChanged, snapToNearest],
  );

  // ── Touch ─────────────────────────────────────────────────────
  const touchLastY = useRef(0);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      touchLastY.current = e.touches[0].clientY;
      velocityRef.current = 0;
      cancelRaf();
    },
    [cancelRaf],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const now = performance.now();
      const dy = touchLastY.current - e.touches[0].clientY;

      velocityRef.current = dy / Math.max(1, now - lastEventTimeRef.current);
      lastEventTimeRef.current = now;
      touchLastY.current = e.touches[0].clientY;

      const next = clampOffset(offsetRef.current + dy);
      offsetRef.current = next;
      setOffset(next);
      notifyIfChanged(next);
    },
    [clampOffset, notifyIfChanged],
  );

  const handleTouchEnd = useCallback(() => {
    snapToNearest(offsetRef.current, velocityRef.current * MOMENTUM_DECAY);
  }, [snapToNearest]);

  // ── Event binding ─────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      cancelRaf();
    };
  }, [
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    cancelRaf,
  ]);

  const activeIndex = Math.min(
    itemCount - 1,
    Math.max(0, Math.round(offset / ITEM_HEIGHT)),
  );

  const seekToIndex = useCallback(
    (targetIndex: number) => {
      cancelRaf();
      const start = offsetRef.current;
      const end = clampOffset(targetIndex * ITEM_HEIGHT);
      const distance = Math.abs(end - start) / ITEM_HEIGHT;
      const duration = Math.min(300 + distance * 100, 1400);
      const startTime = performance.now();

      const animate = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = start + (end - start) * easeInOutExpo(progress);

        offsetRef.current = current;
        setOffset(current);
        notifyIfChanged(current);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          offsetRef.current = end;
          setOffset(end);
          notifyIfChanged(end);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    },
    [cancelRaf, clampOffset, notifyIfChanged],
  );

  return { offset, activeIndex, containerRef, seekToIndex };
}
