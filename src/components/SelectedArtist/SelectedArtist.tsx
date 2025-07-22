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
import { useAudioPlayer } from "@/context/AudioPlayerContext";

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
  const { currentTrackId, isPlaying, playTrack } = useAudioPlayer();

  if (!selectedArtist || !isArtistVisible) return null;

  const renderTrackItem = (track: SpotifyApi.TrackObjectFull) => (
    <div
      className={styles.carousel__item}
      onMouseDown={() => playTrack(track.id, track.preview_url || "")}
    >
      <Vinyl track={track} />
      <div>
        <Link
          href={track.uri}
          className={styles.carousel__trackName}
          title={track.name}
        >
          {track.name}
        </Link>
      </div>
    </div>
  );

  return (
    <motion.div
      className={styles.selectedArtist}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: TRANSITION_DURATION }}
    >
      <button
        className={styles.selectedArtist__backLink}
        onClick={() => {
          handleCloseArtist();
          playTrack("", "");
        }}
      >
        <ChevronLeftIcon className={styles.backIcon} />
        back
      </button>

      <Link
        className={styles.selectedArtist__cover}
        href={selectedArtist.uri}
        target="_blank"
        rel="noopener noreferrer"
      >
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

        <div
          className={styles.selectedArtist__name}
          title={selectedArtist.name}
        >
          {selectedArtist.name}
        </div>
      </Link>
      <div className={styles.selectedArtist__details}>
        <div className={styles.selectedArtist__meta}>
          <div className={styles.selectedArtist__pill}>
            <div>popularity</div>
            <div>{mapPopularity(selectedArtist.popularity)}</div>
          </div>
          <div className={styles.selectedArtist__pill}>
            <div>followers</div>
            <div>{selectedArtist.followers.total.toLocaleString()}</div>
          </div>
          <AnimatePresence mode="wait">
            {selectedArtist.genres.length > 0 && (
              <motion.div className={styles.selectedArtist__pill}>
                <div>genres</div>
                <div>{selectedArtist.genres.join(", ")}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {data && (
              <>
                <motion.div
                  className={clsx(
                    styles.selectedArtist__meta,
                    styles.selectedArtist__latestRelease,
                    styles.selectedArtist__pill
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ReleaseRadar latestRelease={data?.latestRelease} />
                </motion.div>
                <motion.div
                  className={styles.selectedArtist__meta}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: TRANSITION_DURATION }}
                >
                  <Discography
                    albumCount={data?.albumCount}
                    singleCount={data?.singleCount}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          className={styles.selectedArtist__carousel}
          initial={{
            opacity: 0,
            filter: "blur(32px)",
          }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            filter: "blur(32px)",
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <h2 className={styles.carousel__title}>Top Tracks</h2>
          {data && (
            <Carousel
              key={data.topTracks[0]?.id}
              items={data.topTracks.slice(0, 8)}
              renderItem={renderTrackItem}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
