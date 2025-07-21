import { useRef } from "react";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import styles from "./Vinyl.module.scss";
import clsx from "clsx";

export default function Vinyl({
  track,
}: {
  track: SpotifyApi.TrackObjectFull;
}) {
  const { currentTrackId, isPlaying, playTrack } = useAudioPlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isActive = currentTrackId === track.id && isPlaying;

  const handlePlay = () => {
    if (audioRef.current) {
      playTrack(track.id, track.preview_url || "");
    }
  };

  return (
    <div className={styles.vinyl} onClick={handlePlay}>
      <img
        src={track.album.images[0]?.url || "/img/placeholder-album.png"}
        alt={track.name}
        className={clsx(styles.vinyl__image, {
          [styles["vinyl__image--playing"]]: isActive,
        })}
      />
      <div className={styles.vinyl__centerDot} />
    </div>
  );
}
