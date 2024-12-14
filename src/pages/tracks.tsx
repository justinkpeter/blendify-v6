import React from "react";
import Filters from "@/components/Filters/Filters";
import spotifyApi from "@/lib/spotify";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { TracksProvider } from "@/context/TracksContext";
import TrackList from "@/components/TrackList/TrackList";
import SelectedTrackDetails from "@/components/SelectedTrackDetails/SelectedTrackDetails";
import styles from "@/styles/pages/tracks.module.scss";

export default function Tracks({
  initialTopTracks,
}: {
  initialTopTracks: SpotifyApi.TrackObjectFull[];
}) {
  return (
    <TracksProvider>
      <div className={styles.tracks}>
        <div className={styles.trackSelection}>
          <div className={styles.trackSelection__desc}>(Select a track)</div>
          <div className={styles.trackSelection__list}>
            <Filters />
            <TrackList tracks={initialTopTracks} />
          </div>
        </div>
        <SelectedTrackDetails />
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
    .getMyTopTracks({ limit: 10, time_range: "short_term" })
    .then((data) => data.body.items);

  return { props: { initialTopTracks: topTracks } };
}
