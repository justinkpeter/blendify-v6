import {
  ChevronLeftIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useArtistMetadata } from "@/hooks/useArtistMetadata";
import Link from "next/link";
import Image from "next/image";
import styles from "./SelectedTrack.module.scss";
import Badge from "../Badge/Badge";
import Carousel from "../Carousel/Carousel";
import clsx from "clsx";
import useAudioPlayer from "../AudioPlayer/useAudioPlayer";

const TRANSITION_DURATION = 300;

export default function SelectedTrack({
  handleCloseTrack,
  isTrackVisible,
  selectedTrack,
}: {
  isTrackVisible: boolean;
  handleCloseTrack: () => void;
  handleTrackSelection: (track: SpotifyApi.TrackObjectFull) => void;
  selectedTrack: SpotifyApi.TrackObjectFull | null;
}) {
  const { metadata: artistMetadata, genreList } = useArtistMetadata(
    selectedTrack,
    isTrackVisible
  );
  const { isPlaying, audioRef, togglePlay } = useAudioPlayer();

  if (!selectedTrack || !isTrackVisible) return null;

  const renderItem = (artist: SpotifyApi.ArtistObjectFull) => (
    <Link
      key={artist.id}
      href={artist.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.selectedTrack__artist}
      title={artist.name}
    >
      <Image
        src={artist.images[0]?.url || "/img/placeholder-artist.png"}
        alt={artist.name}
        width={32}
        height={32}
        className={styles.selectedTrack__artistImage}
        draggable={false}
      />
      <div>{artist.name}</div>
    </Link>
  );

  return (
    <motion.div
      className={styles.selectedTrack}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.2 },
      }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: TRANSITION_DURATION / 1000 }}
    >
      <button
        className={styles.selectedTrack__backLink}
        onClick={handleCloseTrack}
      >
        <ChevronLeftIcon className={styles.backIcon} />
        back
      </button>

      <div className={styles.selectedTrack__cover}>
        <audio ref={audioRef} src={selectedTrack.preview_url ?? undefined} />

        {/* Animate image outside of Vinyl to keep layoutId intact */}
        <motion.img
          src={selectedTrack.album.images[0].url}
          alt={selectedTrack.name}
          className={clsx(styles.selectedTrack__image, {
            [styles["selectedTrack__image--playing"]]: isPlaying,
          })}
          layoutId={`track-image-${selectedTrack.id}`}
          transition={{
            layout: {
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1], // ease-in-out
            },
          }}
        />

        <div className={styles.controls}>
          {isPlaying ? (
            <button onClick={togglePlay} className={styles.controlButton}>
              <PauseIcon className={styles.playIcon} />
            </button>
          ) : (
            <button onClick={togglePlay} className={styles.controlButton}>
              <PlayIcon className={styles.playIcon} />
            </button>
          )}
        </div>
      </div>
      <motion.div
        className={styles.selectedTrack__details}
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
      >
        <Link
          href={selectedTrack.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.selectedTrack__name}
          title={selectedTrack.name}
        >
          {selectedTrack.name}
        </Link>
        <div
          className={clsx(
            styles.selectedTrack__meta,
            styles.selectedTrack__artists
          )}
        >
          {artistMetadata && (
            <Carousel items={artistMetadata} renderItem={renderItem} />
          )}
        </div>
        <div className={styles.selectedTrack__meta}>
          <div className={styles.selectedTrack__pill}>
            <div className={styles.selectedTrack__albumCover}>
              <Image
                src={selectedTrack.album.images[0]?.url}
                alt={selectedTrack.album.name}
                width={32}
                height={32}
                className={styles.selectedTrack__albumCoverImage}
              />
              <div>
                <div>{selectedTrack.album.album_type}</div>
                <Link
                  href={selectedTrack.album.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.selectedTrack__albumName}
                  title={selectedTrack.album.name}
                >
                  {selectedTrack.album.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
        {genreList && genreList.length > 0 && (
          <div className={styles.selectedTrack__meta}>
            {genreList.map((genre, index) => (
              <Badge key={index}>{genre}</Badge>
            ))}
          </div>
        )}
        <div className={styles.selectedTrack__meta}>
          <i>
            released on{" "}
            {new Date(selectedTrack.album.release_date)
              .toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
              .replace(/\//g, ".")}
          </i>
        </div>
      </motion.div>
    </motion.div>
  );
}
