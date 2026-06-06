import React from "react";
import Image from "next/image";
import Link from "next/link";
import TimelineBar from "./TimelineBar";
import styles from "./AudioPlayer.module.scss";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { Play, CirclePauseIcon } from "lucide-react";
import { ExplicitBadge } from "../MetaPanel/MetaPanel";
import Marquee from "@/components/Marquee/Marquee";

export default function AudioPlayer({
  src,
  name,
  id,
  isExplicit,
  hideLabel = false,
}: {
  src?: string | null;
  name?: string | null;
  id?: string | null;
  isExplicit?: boolean;
  hideLabel?: boolean;
}) {
  const { isPlaying, playTrack, progress, handleScrub } = useAudioPlayer();

  if (!src) {
    return <div className={styles["audio-player"]}>No preview available</div>;
  }

  return (
    <div className={styles["audio-player"]}>
      <div className={styles.spotifyLink}>
        <Link
          href={`https://open.spotify.com/track/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          title={"View this song On Spotify"}
        >
          <Image
            src="img/spotify-icon-white.png"
            alt="Spotify Icon"
            width={18}
            height={18}
          />
        </Link>
        {!hideLabel && (
          <Marquee
            className={styles.trackName}
            onClick={() => playTrack("currentTrackId", src)}
          >
            {name}
          </Marquee>
        )}
        {!hideLabel && <ExplicitBadge isExplicit={isExplicit} />}
      </div>
      <div className={styles.controls}>
        <button
          className={styles.toggleButton}
          onClick={() => playTrack("currentTrackId", src)}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <CirclePauseIcon size={24} /> : <Play />}
        </button>
        <TimelineBar progress={progress} handleScrub={handleScrub} />
      </div>
    </div>
  );
}
