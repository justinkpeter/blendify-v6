import React from "react";
import { PlayIcon, StopIcon } from "@heroicons/react/24/solid";
import styles from "./PlayPauseControl.module.scss";

export default function PlayPauseControl({
  isPlaying,
  onTogglePlay,
}: {
  isPlaying: boolean;
  onTogglePlay: () => void;
}) {
  return (
    <button onClick={onTogglePlay} className={styles.toggleButton}>
      <div className={isPlaying ? styles.paused : ""}>
        <span>play</span>
        <span>pause</span>
      </div>
      {isPlaying ? <StopIcon /> : <PlayIcon />}
    </button>
  );
}
