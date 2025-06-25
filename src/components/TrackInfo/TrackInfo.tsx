import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import styles from "./TrackInfo.module.scss";

export default function TrackInfo({
  topTracks,
  hoveredIndex,
}: {
  topTracks: SpotifyApi.TrackObjectFull[];
  hoveredIndex: number | null;
}) {
  const track = topTracks[hoveredIndex ?? 0];

  const lines = useMemo(() => {
    return [
      track.name,
      `${track.artists.map((artist) => artist.name).join(", ")}`,
      `Appears on album "${track.album.name}" / track #${track.track_number}`,
    ];
  }, [track]);

  const containerVariants = {
    enter: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const lineVariants = {
    initial: { y: "100%", opacity: 0, scale: 0.98, filter: "blur(6px)" },
    enter: {
      y: "0%",
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
    },
    exit: {
      y: "-100%",
      opacity: 0,
      transition: { duration: 0.2 },
      filter: "blur(6px)",
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={hoveredIndex}
        className={styles.trackInfo}
        variants={containerVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {lines.map((line, index) => (
          <motion.div
            key={index}
            variants={lineVariants}
            className={styles.trackInfo__line}
          >
            {line}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
