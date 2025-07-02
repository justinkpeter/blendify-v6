import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import styles from "./ArtistInfo.module.scss";

export default function ArtistInfo({
  topArtists,
  hoveredIndex,
}: {
  topArtists: SpotifyApi.ArtistObjectFull[];
  hoveredIndex: number | null;
}) {
  const artist = topArtists[hoveredIndex ?? 0];

  const lines = useMemo(() => {
    return [artist.name, `[ Popularity: ${mapPopularity(artist.popularity)} ]`];
  }, [artist]);

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

function mapPopularity(popularity: number) {
  if (popularity >= 90) return "Global Icon";
  if (popularity >= 75) return "Mainstream";
  if (popularity >= 60) return "On the Radar";
  if (popularity >= 40) return "Indie Favorite";
  return "Hidden Gem";
}
