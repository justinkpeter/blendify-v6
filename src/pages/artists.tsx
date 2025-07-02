import React, { useState } from "react";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import spotifyApi from "@/lib/spotify";
import styles from "@/styles/pages/artists.module.scss";
import SlidingTabBar from "@/components/SlidingButtonBar/SlidingButtonBar";
import Carousel from "@/components/Carousel/Carousel";
import CarouselArtistItem from "@/components/CarouselArtistItem/CarouselArtistItem";
import ArtistInfo from "@/components/ArtistInfo/ArtistInfo";
import SelectedArtist from "@/components/SelectedArtist/SelectedArtist";
import useSelectedArtist from "@/components/SelectedArtist/useSelectedArtist";
import useTopArtists from "@/hooks/useTopArtists";
import { TimeRange, TimeRangeOptions } from "@/constants/timeRange";

export default function Artists({
  initialTopArtists,
}: {
  initialTopArtists: SpotifyApi.ArtistObjectFull[];
}) {
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange>(
    TimeRange.Short
  );

  const { topArtists } = useTopArtists(activeTimeRange, initialTopArtists);

  const {
    selectedArtist,
    isArtistVisible,
    hoveredIndex,
    setHoveredIndex,
    handleArtistSelection,
    handleCloseArtist,
  } = useSelectedArtist();

  const mainMotionProps = {
    initial: { opacity: 0, y: 20, filter: "blur(8px)" },
    animate: {
      opacity: isArtistVisible ? 0 : 1,
      y: isArtistVisible ? 20 : 0,
      filter: isArtistVisible ? "blur(8px)" : "blur(0px)",
      pointerEvents: isArtistVisible ? "none" : "auto",
    },
    transition: { duration: 0.3 },
    className: styles.artists,
  } as const;

  return (
    <>
      {/* Artist Detail Overlay */}
      <AnimatePresence mode="wait">
        {isArtistVisible && (
          <SelectedArtist
            selectedArtist={selectedArtist}
            isArtistVisible={isArtistVisible}
            handleArtistSelection={handleArtistSelection}
            handleCloseArtist={handleCloseArtist}
          />
        )}
      </AnimatePresence>
      {/* Carousel + Filters */}
      <motion.main {...mainMotionProps}>
        <div className={styles.artists__title}>your artist lineup</div>
        <SlidingTabBar
          tabs={TimeRangeOptions}
          activeTabIndex={TimeRangeOptions.findIndex(
            (option) => option.value === activeTimeRange
          )}
          onTabClick={(index: number) =>
            setActiveTimeRange(TimeRangeOptions[index].value)
          }
        />
        <div className={styles.artists__carousel}>
          <Carousel
            key={activeTimeRange}
            items={topArtists}
            renderItem={(artist, index) => (
              <CarouselArtistItem
                key={artist.id}
                artist={artist}
                index={index}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
                handleArtistSelection={handleArtistSelection}
              />
            )}
          />
        </div>
        <ArtistInfo topArtists={topArtists} hoveredIndex={hoveredIndex} />
      </motion.main>
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

  const topArtists = await spotifyApi
    .getMyTopArtists({ limit: 12, time_range: "short_term" })
    .then((res) => res.body.items);

  return { props: { initialTopArtists: topArtists } };
}
