import React from "react";
import { useTracksContext } from "@/context/TracksContext";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./SelectedTrackDetails.module.scss";
import TrackMeta from "./TrackMeta";
import TrackOverview from "./TrackOverview";
import TrackRecommendations from "./TrackRecommendations";

export default function SelectedTrackDetails() {
  const { selectedTrack } = useTracksContext();

  return (
    <AnimatePresence mode="wait">
      {selectedTrack && (
        <motion.div
          key={selectedTrack.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.selectedTrack}
        >
          <TrackOverview track={selectedTrack} />
          <div className={styles.metaAndRecommendations}>
            <TrackMeta
              album={selectedTrack.album}
              artists={selectedTrack.artists}
            />
            <TrackRecommendations seed={selectedTrack.id} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
