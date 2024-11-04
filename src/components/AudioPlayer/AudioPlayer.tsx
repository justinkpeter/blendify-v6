import React from "react";
import TimelineBar from "../TimelineBar/TimelineBar";
import PlayPauseControl from "../PlayPauseControl/PlayPauseControl";
import useAudioPlayer from "./useAudioPlayer";
import styles from "./AudioPlayer.module.scss";

export default function AudioPlayer({ src }: { src: string }) {
  const { audioRef, isPlaying, togglePlay, progress, handleScrub } =
    useAudioPlayer(src);

  return (
    <div className={styles["audio-player"]}>
      <audio ref={audioRef} src={src} />
      <PlayPauseControl isPlaying={isPlaying} onTogglePlay={togglePlay} />
      <TimelineBar progress={progress} handleScrub={handleScrub} />
    </div>
  );
}
