import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./SelectedArtist.module.scss";
import useArtistDetails from "./useArtistDetails";
import { mapPopularity } from "../ArtistInfo/ArtistInfo";
import ReleaseRadar from "./ReleaseRadar";
import Discography from "./Discography";
import Carousel from "../Carousel/Carousel";
import Vinyl from "../Vinyl/Vinyl";
import clsx from "clsx";
import Link from "next/link";

const TRANSITION_DURATION = 0.3; // seconds

export default function SelectedArtist({
  handleCloseArtist,
  isArtistVisible,
  selectedArtist,
}: {
  isArtistVisible: boolean;
  handleCloseArtist: () => void;
  handleArtistSelection?: (artist: SpotifyApi.ArtistObjectFull) => void;
  selectedArtist: SpotifyApi.ArtistObjectFull | null;
}) {
  const { data, loading } = useArtistDetails(
    isArtistVisible,
    selectedArtist?.id
  );

  if (!selectedArtist || !isArtistVisible) return null; // early return

  return (
    <motion.div
      className={styles.selectedArtist}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: TRANSITION_DURATION }}
    >
      <button
        className={styles.selectedArtist__backLink}
        onClick={handleCloseArtist}
      >
        <ChevronLeftIcon className={styles.backIcon} />
        back
      </button>

      <div className={styles.selectedArtist__cover}>
        <motion.img
          src={selectedArtist.images[0]?.url || "/img/placeholder-artist.png"}
          alt={selectedArtist.name}
          layoutId={`artist-image-${selectedArtist.id}`}
          className={styles.selectedArtist__image}
        />
        <motion.img
          src="/img/spotify-icon-white.png"
          alt="spotify-logo"
          className={styles.spotifyProfileIcon}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              delay: 0.4,
            },
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: TRANSITION_DURATION * 2 }}
        />
      </div>
      <div className={styles.selectedArtist__details}>
        <Link
          href={selectedArtist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.selectedArtist__name}
          title={selectedArtist.name}
        >
          {selectedArtist.name}
        </Link>
        <div className={styles.selectedArtist__meta}>
          <div className={styles.selectedArtist__pill}>
            <div>popularity</div>
            <div>{mapPopularity(selectedArtist.popularity)}</div>
          </div>
          <div className={styles.selectedArtist__pill}>
            <div>followers</div>
            <div>{selectedArtist.followers.total.toLocaleString()}</div>
          </div>
          {selectedArtist.genres.length > 0 && (
            <div className={styles.selectedArtist__pill}>
              <div>genres</div>
              <div>{selectedArtist.genres.join(", ")}</div>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              className={clsx(
                styles.selectedArtist__meta,
                styles.selectedArtist__releaseRadar
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: TRANSITION_DURATION }}
            >
              <ReleaseRadar latestRelease={data?.latestRelease} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              className={styles.selectedArtist__meta}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: TRANSITION_DURATION }}
            >
              <Discography
                albumCount={data?.albumCount}
                singleCount={data?.singleCount}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        <motion.div className={styles.selectedArtist__carousel}>
          <h2 className={styles.carousel__title}>Top Tracks</h2>
          {data && (
            <Carousel
              items={data?.topTracks.slice(0, 8) || []}
              renderItem={(track, index) => (
                <div className={styles.carousel__item} key={index}>
                  <Vinyl
                    track={track}
                    isVisible={true}
                    onClose={() => {}}
                    onSelectTrack={() => {}}
                    key={index}
                  />
                  <div>
                    <Link
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.carousel__trackName}
                      title={track.name}
                    >
                      {track.name}
                    </Link>
                  </div>
                </div>
              )}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
