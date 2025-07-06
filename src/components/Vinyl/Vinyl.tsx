import React from "react";
import { motion } from "framer-motion";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import styles from "./Vinyl.module.scss";
import useAudioPlayer from "../AudioPlayer/useAudioPlayer";
import clsx from "clsx";
import Link from "next/link";

export default function Vinyl({
  track,
}: {
  track: SpotifyApi.TrackObjectFull | null;
  isVisible?: boolean;
  onClose: () => void;
  onSelectTrack: (track: SpotifyApi.TrackObjectFull) => void;
}) {
  const { isPlaying, audioRef, togglePlay } = useAudioPlayer();

  if (!track) return null;

  return (
    <motion.div
      className={styles.vinyl}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <audio ref={audioRef} src={track.preview_url ?? undefined} />

      <div className={styles.vinyl__container}>
        {/* Static Image */}
        <motion.img
          src={track.album.images[0].url}
          alt={track.name}
          className={styles.vinyl__image}
          layoutId={`track-image-${track.id}`}
          title={track.name + " track cover"}
          draggable={false}
        />
        {/* Rotating Record */}
        <motion.img
          src={track.album.images[0].url}
          alt={`${track.name} record spinning`}
          className={`${styles.vinyl__record} ${
            isPlaying ? styles["vinyl__record--playing"] : ""
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ opacity: { duration: 0.1, delay: 0.8 } }}
          title={track.name + " track cover"}
          draggable={false}
        />
        <div
          className={clsx(
            styles.vinyl__record,
            isPlaying && styles["vinyl__record--playing"]
          )}
        >
          <img
            src={track.album.images[0].url}
            alt={`${track.name} record `}
            className={styles.vinyl__overlay}
          />
        </div>
        <Link
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={"/img/spotify-icon-white.png"}
            className={styles.vinyl__spotifyIcon}
          />
        </Link>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {isPlaying ? (
          <button
            className={styles.controlButton}
            onClick={togglePlay}
            aria-label="Pause"
            title="Pause"
          >
            <PauseIcon className={styles.playIcon} />
          </button>
        ) : (
          <button
            className={styles.controlButton}
            onClick={togglePlay}
            aria-label="Play"
            title={"Play track preview"}
          >
            <PlayIcon className={styles.playIcon} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
