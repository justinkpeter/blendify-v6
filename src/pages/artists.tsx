import React, { useState } from "react";
import spotifyApi from "@/lib/spotify";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import styles from "@/styles/pages/artists.module.scss";
// import Carousel from "@/components/Carousel/Carousel";
// import Filters, { FilterValue } from "@/components/Filters/Filters";

import useTopArtists, { ArtistWithPreview } from "@/hooks/useTopArtists";
// import ArtistItem from "@/components/Carousel/ArtistItem";

export default function Artists({
  initialTopArtists,
}: {
  initialTopArtists: ArtistWithPreview[];
}) {
  // const [activeFilter, setActiveFilter] = useState<FilterValue>("short_term");
  // const { topArtists, isLoading } = useTopArtists(
  //   activeFilter,
  //   initialTopArtists
  // );

  return (
    <main className={styles.artists}>
      <header className={styles.artists__header}>
        <h1>your artists</h1>
        <div>
          <span>who all understands your unique vibe?</span>
        </div>
      </header>
      <div className={styles.artists__filters}>
        {/* <Filters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        /> */}
      </div>
      <section className={styles.artists__carousel}>
        {/* <Carousel
          loading={isLoading}
          items={topArtists}
          renderItem={(artist) => (
            <ArtistItem
              image={artist.images[0].url}
              name={artist.name}
              genres={artist.genres}
              monthlyListeners={artist.followers.total}
              preview={artist.previewUri}
              artistUri={artist.uri}
            />
          )}
        /> */}
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

  const topArtists = await spotifyApi
    .getMyTopArtists({ limit: 12, time_range: "short_term" })
    .then((data) => data.body.items);

  const artistsWithPreview = await Promise.all(
    topArtists.map(async (artist) => {
      const topTrack = await spotifyApi
        .getArtistTopTracks(artist.id, "US")
        .then((response) => response.body.tracks[0]);

      return {
        ...artist,
        previewUri: topTrack?.preview_url || null,
      };
    })
  );

  return { props: { initialTopArtists: artistsWithPreview } };
}
