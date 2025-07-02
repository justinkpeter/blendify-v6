import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { useArtistMetadata } from "@/hooks/useArtistMetadata";
import Link from "next/link";
import Image from "next/image";
import Vinyl from "../Vinyl/Vinyl";
import TrackDetails from "./TrackDetails";
import styles from "./SelectedTrack.module.scss";

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

  return (
    <AnimatePresence mode="wait">
      {selectedTrack && isTrackVisible && (
        <motion.div
          className={styles.selectedTrack}
          key="selected-track"
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
          <button className={styles.backLink} onClick={handleCloseTrack}>
            <ChevronLeftIcon className={styles.backIcon} />
            BACK
          </button>
          <div className={styles.selectedTrack__vinyl}>
            <Vinyl
              track={selectedTrack}
              isVisible={isTrackVisible}
              onClose={handleCloseTrack}
              onSelectTrack={handleTrackSelection}
            />
            <Link
              href={selectedTrack.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.h1
                className={styles.selectedTrack__title}
                title={selectedTrack.name}
              >
                <Image
                  src={"/img/spotify-icon-white.png"}
                  width={30}
                  height={30}
                  alt="Spotify Icon"
                  title="Listen on Spotify"
                  className={styles.spotifyIcon}
                />
                {selectedTrack.name}
              </motion.h1>
              <div className={styles.albumName}>
                from the album{" "}
                <Link href={selectedTrack.album.external_urls.spotify}>
                  <i>{selectedTrack.album.name}</i>
                </Link>
              </div>
            </Link>
          </div>
          <TrackDetails
            artistMetadata={artistMetadata}
            releaseDate={selectedTrack.album.release_date}
            genreList={genreList}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
