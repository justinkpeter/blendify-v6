import React, { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { TimeRange, TimeRangeOptions } from "@/constants/timeRange";
import { motion } from "framer-motion";
import { useSelectedTrack } from "@/hooks/useSelectedTrack";
import CarouselTrackItem from "@/components/CarouselTrackItem/CarouselTrackItem";
import Carousel from "@/components/Carousel/Carousel";
import SelectedTrack from "@/components/SelectedTrack/SelectedTrack";
import SlidingTabBar from "@/components/SlidingButtonBar/SlidingButtonBar";
import TrackInfo from "@/components/TrackInfo/TrackInfo";
import spotifyApi from "@/lib/spotify";
import useTopTracks from "@/hooks/useTopTracks";

import styles from "@/styles/pages/tracks.module.scss";

export default function Tracks({
  initialTopTracks,
}: {
  initialTopTracks: SpotifyApi.TrackObjectFull[];
}) {
  const [activeTimeRangeFilter, setActiveTimeRangeFilter] = useState<TimeRange>(
    TimeRange.Short
  );
  const { topTracks } = useTopTracks(activeTimeRangeFilter, initialTopTracks);
  const {
    selectedTrack,
    setHoveredIndex,
    hoveredIndex,
    handleTrackSelection,
    handleCloseTrack,
    isTrackVisible,
  } = useSelectedTrack();

  // when the time range filter changes, reset the hovered index
  useEffect(() => {
    setHoveredIndex(0);
  }, [activeTimeRangeFilter, setHoveredIndex]);

  return (
    <>
      {/* Main Track Carousel */}
      <motion.main
        className={styles.tracks}
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{
          opacity: isTrackVisible ? 0 : 1,
          pointerEvents: isTrackVisible ? "auto" : "none",
          filter: "blur(0px)",
          y: 0,
        }}
        exit={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        transition={{ duration: 0.3 }}
        layoutId="tracks-main"
        style={{
          pointerEvents: isTrackVisible ? "none" : "auto",
        }}
      >
        <div className={styles.titleWrapper}>
          <div className={styles.title}>songs on repeat</div>
        </div>
        <SlidingTabBar
          tabs={TimeRangeOptions}
          activeTabIndex={TimeRangeOptions.findIndex(
            (option) => option.value === activeTimeRangeFilter
          )}
          onTabClick={(index: number) =>
            setActiveTimeRangeFilter(TimeRangeOptions[index].value)
          }
        />
        <div className={styles.tracks__carousel}>
          <Carousel
            key={activeTimeRangeFilter}
            items={topTracks}
            renderItem={(track, index) => (
              <CarouselTrackItem
                track={track}
                index={index}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
                handleTrackSelection={handleTrackSelection}
              />
            )}
          />
        </div>
        <TrackInfo
          topTracks={topTracks}
          hoveredIndex={hoveredIndex}
          key={activeTimeRangeFilter}
        />
      </motion.main>
      {/* Selected Track Overlay */}
      <SelectedTrack
        handleTrackSelection={handleTrackSelection}
        handleCloseTrack={handleCloseTrack}
        isTrackVisible={isTrackVisible}
        selectedTrack={selectedTrack}
      />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  spotifyApi.setAccessToken(session.accessToken as string);
  spotifyApi.setRefreshToken(session.refreshToken as string);

  const topTracks = await spotifyApi
    .getMyTopTracks({ limit: 12, time_range: TimeRange.Short })
    .then((data) => data.body.items);

  return { props: { initialTopTracks: topTracks } };
}
