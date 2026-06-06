"use client";

import { useRef } from "react";
import styles from "./LoadingScreen.module.scss";
import { useLoadingProgress } from "./useLoadingProgress";
import { useLoadingSequence, Phase } from "./useLoadingSequence";
import { useDitherCanvas } from "./useDitherCanvas";

interface LoadingScreenProps {
  promise: Promise<unknown>;
  onComplete: () => void;
}

export default function LoadingScreen({
  promise,
  onComplete,
}: LoadingScreenProps) {
  const wordmarkRef = useRef<HTMLHeadingElement>(null);

  const { progress } = useLoadingProgress({ promise });
  const { phase, flipOrigin } = useLoadingSequence(
    progress,
    onComplete,
    wordmarkRef,
  );
  const { canvasRef } = useDitherCanvas("/img/cassette.jpg", progress, phase);

  const isExiting = phase !== Phase.Loading;
  const isFlipping = phase === Phase.WordmarkTransition;

  // Derived — cassette visible only during loading
  const cassetteOpacity = phase === Phase.Loading ? 1 : 0;

  // Snaps fixed position to measured in-flow origin — prevents jump on static → fixed
  const wordmarkStyle =
    isFlipping && flipOrigin
      ? {
          position: "fixed" as const,
          top: flipOrigin.top,
          left: flipOrigin.left,
        }
      : {};

  return (
    <div
      className={`${styles.loader} ${isFlipping ? styles["loader--flipping"] : ""}`}
    >
      <div className={styles.loader__card}>
        <h1
          ref={wordmarkRef}
          className={`${styles.loader__wordmark} ${isFlipping ? styles["loader__wordmark--flip"] : ""}`}
          style={wordmarkStyle}
        >
          .blendify
        </h1>

        {/* Everything below fades out together */}
        <div
          className={`${styles.loader__content} ${isExiting ? styles["loader__content--exit"] : ""}`}
        >
          <div
            className={styles.loader__cassette}
            style={{
              opacity: cassetteOpacity,
              transition:
                phase === Phase.CassetteFading
                  ? "opacity 0.85s ease-in-out"
                  : "none",
            }}
          >
            <canvas ref={canvasRef} className={styles.loader__canvas} />
          </div>

          <p className={styles.loader__descriptor}>
            your music taste, in full.
          </p>

          <div className={styles.loader__progressWrap}>
            <div
              className={styles.loader__progressBar}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
