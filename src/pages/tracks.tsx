import React, { useState } from "react";
import { GetServerSidePropsContext } from "next";
import { FilterValue } from "@/components/Filters/Filters";
import { getSession } from "next-auth/react";
import spotifyApi from "@/lib/spotify";
import styles from "@/styles/pages/tracks.module.scss";
import Carousel from "@/components/Carousel/Carousel";
import TrackItem from "@/components/Carousel/TrackItem";

import useTopTracks from "@/hooks/useTopTracks";

export default function Tracks({
  initialTopTracks,
}: {
  initialTopTracks: SpotifyApi.TrackObjectFull[];
}) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("short_term");

  const { topTracks, isLoading } = useTopTracks(activeFilter, initialTopTracks);

  return (
    <main className={styles.tracks}>
      <div className={styles.tracks__header}>
        <h1>songs on repeat</h1>
        <div>Your most played tracks.</div>
      </div>
      <div className={styles.tracks__filters}>
        {["short_term", "medium_term", "long_term"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as FilterValue)}
            className={activeFilter == filter ? styles.active : ""}
          >
            {filter == "short_term"
              ? "4 Weeks"
              : filter == "medium_term"
              ? "6 Months"
              : "Last Year"}
          </button>
        ))}
      </div>
      <div className={styles.tracks__carousel}>
        <Carousel
          loading={isLoading}
          items={topTracks}
          renderItem={(track) => (
            <TrackItem
              album={track.album}
              name={track.name}
              preview={track.preview_url}
              trackUri={track.uri}
            />
          )}
        />
      </div>
    </main>
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
    .getMyTopTracks({ limit: 12, time_range: "short_term" })
    .then((data) => data.body.items);

  return { props: { initialTopTracks: topTracks } };
}
