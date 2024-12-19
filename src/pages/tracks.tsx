import React from "react";
import spotifyApi from "@/lib/spotify";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { TracksProvider } from "@/context/TracksContext";
import styles from "@/styles/pages/tracks.module.scss";
import Carousel from "@/components/Carousel/Carousel";
import TrackItem from "@/components/Carousel/TrackItem";

export default function Tracks({
  initialTopTracks,
}: {
  initialTopTracks: SpotifyApi.TrackObjectFull[];
}) {
  return (
    <TracksProvider>
      <div className={styles.tracks}>
        <Carousel
          items={initialTopTracks}
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
    </TracksProvider>
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
