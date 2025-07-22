import React from "react";
import PlayPauseControl from "../PlayPauseControl/PlayPauseControl";
import styles from "./AudioPlayer.module.scss";
import { useAudioPlayer } from "@/context/AudioPlayerContext";

export default function AudioPlayer({ src }: { src: string | null }) {
  const { isPlaying, playTrack } = useAudioPlayer();

  if (!src) {
    return <div className={styles["audio-player"]}>No preview available</div>;
  }

  return (
    <div className={styles["audio-player"]}>
      <PlayPauseControl
        isPlaying={isPlaying}
        onTogglePlay={() => {
          playTrack("currentTrackId", src);
        }}
      />
    </div>
  );
}
