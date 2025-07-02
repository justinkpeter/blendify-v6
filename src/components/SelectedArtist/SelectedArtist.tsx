import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import styles from "./SelectedArtist.module.scss";
import useArtistDetails from "./useArtistDetails";
import SelectedArtistDetails from "./SelectedArtistDetails";
import SelectedArtistSkeleton from "./SelectedArtistSkeleton";

const TRANSITION_DURATION = 0.3; // seconds

// Animation variants for fade
const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 2.4 } },
  exit: { opacity: 0, transition: { delay: 0.8 } },
};

export default function SelectedArtist({
  handleCloseArtist,
  handleArtistSelection,
  isArtistVisible,
  selectedArtist,
}: {
  isArtistVisible: boolean;
  handleCloseArtist: () => void;
  handleArtistSelection: (artist: SpotifyApi.ArtistObjectFull) => void;
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
      key="selected-artist"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: TRANSITION_DURATION }}
    >
      <button className={styles.backLink} onClick={handleCloseArtist}>
        <ChevronLeftIcon className={styles.backIcon} />
        BACK
      </button>

      <div className={styles.selectedArtist__cover}>
        <motion.img
          src={selectedArtist.images[0]?.url || "/img/placeholder-artist.png"}
          alt={selectedArtist.name}
          layoutId={`artist-image-${selectedArtist.id}`}
          className={styles.selectedArtist__image}
        />
        <Link
          href={selectedArtist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.h1
            className={styles.selectedArtist__title}
            title={selectedArtist.name}
            layoutId={`artist-title-${selectedArtist.id}`}
          >
            <Image
              src={"/img/spotify-icon-white.png"}
              width={30}
              height={30}
              alt="Spotify Icon"
              title="Listen on Spotify"
              className={styles.spotifyIcon}
            />
            {selectedArtist.name}
          </motion.h1>
        </Link>
      </div>

      {/* <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.div
              key="skeleton"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={styles.skeletonContainer}
            >
              <SelectedArtistSkeleton />
            </motion.div>
          ) : (
            data && (
              <motion.div
                key="details"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <SelectedArtistDetails
                  data={data}
                  followers={selectedArtist.followers}
                />
              </motion.div>
            )
          )}
        </AnimatePresence> */}
    </motion.div>
  );
}
