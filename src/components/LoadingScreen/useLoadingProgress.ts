import { useEffect, useRef, useState } from "react";

interface UseLoadingProgressOptions {
  /** The promise representing the loading work */
  promise?: Promise<unknown>;
  /** Minimum duration of the loading progress in milliseconds */
  minDuration?: number;
}

export function useLoadingProgress({
  promise,
  minDuration = 1800,
}: UseLoadingProgressOptions = {}) {
  const [progress, setProgress] = useState(0);
  const dataReadyRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    dataReadyRef.current = false;

    const startTime = performance.now();

    // Resolve either the passed promise or immediately if none provided
    const work = promise ?? Promise.resolve();
    work.finally(() => {
      if (mountedRef.current) dataReadyRef.current = true;
    });

    const interval = setInterval(() => {
      if (!mountedRef.current) return;

      const elapsed = performance.now() - startTime;
      const timeProgress = Math.min((elapsed / minDuration) * 100, 90);

      setProgress((prev) => {
        if (prev >= 100) return prev;
        return dataReadyRef.current
          ? Math.min(prev + 0.8, 100)
          : Math.min(prev + 0.3, timeProgress);
      });
    }, 50);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [promise, minDuration]);

  return { progress };
}
