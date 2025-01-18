import React from "react";
import TimelineBar from "../TimelineBar/TimelineBar";
import PlayPauseControl from "../PlayPauseControl/PlayPauseControl";
import useAudioPlayer from "./useAudioPlayer";
import styles from "./AudioPlayer.module.scss";

export default function AudioPlayer({ src }: { src: string | null }) {
  const { audioRef, isPlaying, togglePlay, progress, handleScrub } =
    useAudioPlayer();

  if (!src) {
    return <div className={styles["audio-player"]}>No preview available</div>;
  }

  return (
    <div className={styles["audio-player"]}>
      <audio ref={audioRef} src={src} />
      <PlayPauseControl isPlaying={isPlaying} onTogglePlay={togglePlay} />
      <TimelineBar progress={progress} handleScrub={handleScrub} />
    </div>
  );
}
