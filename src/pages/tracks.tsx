import React, { useState } from "react";
import spotifyApi from "@/lib/spotify";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import styles from "@/styles/pages/tracks.module.scss";
import Carousel from "@/components/Carousel/Carousel";
import TrackItem from "@/components/Carousel/TrackItem";
import Filters, { FilterValue } from "@/components/Filters/Filters";

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
      <header className={styles.tracks__header}>
        <h1>your sound</h1>
        <div>
          <span>what’s been playing on repeat</span>
        </div>
      </header>
      <div className={styles.tracks__filters}>
        <Filters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>
      <section className={styles.tracks__carousel}>
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
      </section>
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
