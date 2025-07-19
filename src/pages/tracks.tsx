import React, { useCallback, useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { TimeRange, TimeRangeOptions } from "@/constants/timeRange";
import { AnimatePresence, motion } from "framer-motion";
import { useSelectedTrack } from "@/hooks/useSelectedTrack";
import CarouselTrackItem from "@/components/CarouselTrackItem/CarouselTrackItem";
import Carousel from "@/components/Carousel/Carousel";
import SelectedTrack from "@/components/SelectedTrack/SelectedTrack";
import SlidingTabBar from "@/components/SlidingButtonBar/SlidingButtonBar";
import TrackInfo from "@/components/TrackInfo/TrackInfo";
import spotifyApi from "@/lib/spotify";
import useTopTracks from "@/hooks/useTopTracks";
import Page from "@/components/Page";
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

  const mainMotionProps = {
    initial: { y: 20, filter: "blur(8px)" },
    animate: {
      y: isTrackVisible ? 20 : 0,
      filter: isTrackVisible ? "blur(48px)" : "blur(0px)",
      pointerEvents: isTrackVisible ? "none" : "auto",
    },
    exit: {
      y: 20,
      filter: "blur(8px)",
      opacity: 0,
    },
    transition: { duration: 0.3 },
    className: styles.tracks,
  } as const;

  const renderTrackItem = useCallback(
    (track: SpotifyApi.TrackObjectFull, index: number) => (
      <CarouselTrackItem
        track={track}
        index={index}
        hoveredIndex={hoveredIndex}
        setHoveredIndex={setHoveredIndex}
        handleTrackSelection={handleTrackSelection}
      />
    ),
    [hoveredIndex, setHoveredIndex, handleTrackSelection]
  );

  return (
    <Page className={styles.tracksPage}>
      {/*  Track Detail Overlay */}
      <AnimatePresence mode="wait">
        {isTrackVisible && (
          <SelectedTrack
            selectedTrack={selectedTrack}
            isTrackVisible={isTrackVisible}
            handleTrackSelection={handleTrackSelection}
            handleCloseTrack={handleCloseTrack}
          />
        )}
      </AnimatePresence>
      {/* Carousel + Filters */}
      <motion.main {...mainMotionProps}>
        <div className={styles.tracks__title}>songs on repeat</div>
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
            renderItem={renderTrackItem}
          />
        </div>
        <TrackInfo topTracks={topTracks} hoveredIndex={hoveredIndex} />
      </motion.main>
    </Page>
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
