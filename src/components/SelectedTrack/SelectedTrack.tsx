import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useArtistMetadata } from "@/hooks/useArtistMetadata";
import Link from "next/link";
import Image from "next/image";
import Vinyl from "../Vinyl/Vinyl";
import styles from "./SelectedTrack.module.scss";
import Badge from "../Badge/Badge";
import Carousel from "../Carousel/Carousel";
import clsx from "clsx";

const TRANSITION_DURATION = 300;

export default function SelectedTrack({
  handleCloseTrack,
  handleTrackSelection,
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

  if (!selectedTrack || !isTrackVisible) return null;

  return (
    <>
      <motion.div
        className={styles.selectedTrack}
        initial={{ opacity: 0, y: 0, filter: "blur(8px)" }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            delay: 0.2,
          },
        }}
        exit={{ opacity: 0, y: 0, filter: "blur(8px)" }}
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
          <Vinyl
            track={selectedTrack}
            isVisible={isTrackVisible}
            onClose={handleCloseTrack}
            onSelectTrack={handleTrackSelection}
          />
        </div>

        <div className={styles.selectedTrack__details}>
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
              <Carousel
                items={artistMetadata}
                renderItem={(artist) => (
                  <Link
                    key={artist.id}
                    href={artist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.selectedTrack__artist}
                    title={artist.name}
                  >
                    <Image
                      src={
                        artist.images[0]?.url || "/img/placeholder-artist.png"
                      }
                      alt={artist.name}
                      width={32}
                      height={32}
                      className={styles.selectedTrack__artistImage}
                      draggable={false}
                    />
                    <div>{artist.name}</div>
                  </Link>
                )}
              />
            )}
          </div>
          <div className={styles.selectedTrack__meta}>
            <div className={styles.selectedTrack__pill}>
              <div className={styles.selectedTrack__albumCover}>
                <Image
                  src={
                    selectedTrack.album.images[0]?.url ||
                    "/img/placeholder-album.png"
                  }
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
            Track Released on{" "}
            {new Date(selectedTrack.album.release_date)
              .toLocaleDateString()
              .replace("/", ".")}
          </div>
        </div>
      </motion.div>
    </>
  );
}
