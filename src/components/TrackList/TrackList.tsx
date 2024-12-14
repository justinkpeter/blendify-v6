import React, { useState } from "react";
import { useTracksContext } from "@/context/TracksContext";
import useTopTracks from "@/hooks/useTopTracks";
import { AnimatePresence, motion } from "framer-motion";
import { listVariants, itemVariants } from "./listVariants";
import styles from "./TrackList.module.scss";
import useIndicatorPosition from "./useIndicatorPosition";

export default function TrackList({
  tracks,
}: {
  tracks: SpotifyApi.TrackObjectFull[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { activeFilter, setSelectedTrack } = useTracksContext();
  const { topTracks, isLoading } = useTopTracks(activeFilter.value, tracks);

  const { indicatorTop, listRef } = useIndicatorPosition(activeIndex);

  const handleTrackSelection = (
    track: SpotifyApi.TrackObjectFull,
    i: number
  ) => {
    setActiveIndex(i);
    setSelectedTrack(track);
  };

  if (isLoading) {
    return <div>Loading tracks...</div>;
  }

  return (
    <div className={styles.listContainer}>
      <motion.ul
        className={styles.list}
        ref={listRef}
        variants={listVariants}
        initial="hidden"
        animate="show"
        key={topTracks[0].id}
      >
        <AnimatePresence>
          {topTracks.map((track, i) => (
            <motion.li
              key={track.id}
              variants={itemVariants}
              whileHover={{ x: 10, transition: { duration: "200ms" } }}
              onClick={() => handleTrackSelection(track, i)}
              className={`${styles.list__item} ${
                i === activeIndex ? styles.active : ""
              }`}
            >
              <div>{i + 1}.</div>
              <div>{track.name}</div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {activeIndex !== null && (
        <motion.div
          className={styles.list__indicator}
          animate={{ top: indicatorTop }}
        />
      )}
    </div>
  );
}
