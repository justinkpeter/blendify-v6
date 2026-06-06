import { useEffect, useRef, useState } from "react";

const FADE_DELAY = 600;
const FLIP_DELAY = 850;
const DONE_DELAY = 1000;

export enum Phase {
  Loading = "loading",
  CassetteFading = "cassette-fading",
  WordmarkTransition = "wordmark-transition",
}

export function useLoadingSequence(
  progress: number,
  onComplete: () => void,
  wordmarkRef: React.RefObject<HTMLHeadingElement>,
) {
  const [phase, setPhase] = useState<Phase>(Phase.Loading);
  const [flipOrigin, setFlipOrigin] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const hasTriggeredRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (progress < 100 || hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    const timers: ReturnType<typeof setTimeout>[] = [];

    const t1 = setTimeout(() => {
      setPhase(Phase.CassetteFading);

      const t2 = setTimeout(() => {
        if (wordmarkRef.current) {
          const rect = wordmarkRef.current.getBoundingClientRect();
          setFlipOrigin({
            top: rect.top + rect.height / 2,
            left: rect.left + rect.width / 2,
          });
        }
        setPhase(Phase.WordmarkTransition);

        const t3 = setTimeout(() => {
          onCompleteRef.current();
        }, DONE_DELAY);

        timers.push(t3);
      }, FLIP_DELAY);

      timers.push(t2);
    }, FADE_DELAY);

    timers.push(t1);

    return () => timers.forEach(clearTimeout);
  }, [progress, wordmarkRef]);

  return { phase, flipOrigin };
}
