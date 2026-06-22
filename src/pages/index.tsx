import { useTracksData } from "@/features/tracks/useTracksData";
import { useArtistsData } from "@/features/artists/useArtistsData";
import { useGenresData } from "@/features/genres/useGenresData";
import SlidingButtonBar from "@/components/SlidingButtonBar/SlidingButtonBar";
import Tooltip from "@/components/Tooltip/Tooltip";
import ArtistsMetaPanel from "@/features/artists/ArtistsMetaPanel";
import ArtistsView from "@/features/artists/ArtistsView";
import TracksMetaPanel from "@/features/tracks/TracksMetaPanel";
import TracksView from "@/features/tracks/TracksView";
import GenresView from "@/features/genres/GenresView";
import useHotkeys from "@/hooks/useHotkeys";
import GenresMetaPanel from "@/features/genres/GenresMetaPanel";
import spotifyApi from "@/lib/spotify";
import { PanelRight } from "lucide-react";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { TimeRange } from "@/constants/timeRange";
import { useHomeState } from "@/features/home/useHomeState";
import { TABS } from "@/features/home/tabs";
import styles from "./home.module.scss";
import { AuthError } from "./api/auth/authErrrors";

interface HomeProps {
  initialTopTracks: SpotifyApi.TrackObjectFull[];
  initialTopArtists: SpotifyApi.ArtistObjectFull[];
}

export default function Home({
  initialTopTracks,
  initialTopArtists,
}: HomeProps) {
  const { carouselItems: trackItems, isLoading: tracksLoading } =
    useTracksData(initialTopTracks);
  const { carouselItems: artistItems, isLoading: artistsLoading } =
    useArtistsData(initialTopArtists, initialTopTracks);
  const { genreItems } = useGenresData(
    artistItems.map((i) => i.artist),
    initialTopTracks,
  );

  const {
    activeTabIndex,
    isPanelOpen,
    setIsPanelOpen,
    activeItem,
    handleTabClick,
    handleActiveItemChange,
  } = useHomeState(trackItems, artistItems, genreItems);

  useHotkeys([
    { key: "t", handler: () => handleTabClick(0) },
    { key: "a", handler: () => handleTabClick(1) },
    { key: "g", handler: () => handleTabClick(2) },
    { key: "d", handler: () => setIsPanelOpen((prev) => !prev) },
  ]);

  const trackIndex =
    activeItem?.kind === "track"
      ? trackItems.findIndex((i) => i.track.id === activeItem.track.id)
      : 0;

  const artistIndex =
    activeItem?.kind === "artist"
      ? artistItems.findIndex((i) => i.artist.id === activeItem.artist.id)
      : 0;

  return (
    <>
      <div key={activeTabIndex} className={styles.homePage__hero}>
        {activeTabIndex === 0 && (
          <TracksView
            carouselItems={trackItems}
            isLoading={tracksLoading}
            metaPanel={
              <TracksMetaPanel
                isPanelOpen={isPanelOpen}
                item={activeItem?.kind === "track" ? activeItem : null}
                index={trackIndex + 1}
              />
            }
            onActiveItemChange={handleActiveItemChange}
          />
        )}
        {activeTabIndex === 1 && (
          <ArtistsView
            carouselItems={artistItems}
            isLoading={artistsLoading}
            metaPanel={
              <ArtistsMetaPanel
                isPanelOpen={isPanelOpen}
                item={activeItem?.kind === "artist" ? activeItem : null}
                topTracks={initialTopTracks}
                index={artistIndex + 1}
              />
            }
            onActiveItemChange={handleActiveItemChange}
          />
        )}
        {activeTabIndex === 2 && (
          <GenresView
            genreItems={genreItems}
            metaPanel={
              <GenresMetaPanel
                isPanelOpen={isPanelOpen}
                item={activeItem?.kind === "genre" ? activeItem : null}
              />
            }
            onActiveItemChange={handleActiveItemChange}
          />
        )}
      </div>

      <div className={styles.homePage__controls}>
        <SlidingButtonBar
          tabs={TABS}
          activeTabIndex={activeTabIndex}
          onTabClick={handleTabClick}
        />
        <Tooltip
          text={isPanelOpen ? "Hide Details" : "Open Details"}
          shortcut="D"
        >
          <button
            className={`${styles.homePage__panelButton} ${isPanelOpen ? styles["homePage__panelButton--active"] : ""}`}
            onClick={() => setIsPanelOpen((prev) => !prev)}
          >
            <PanelRight strokeWidth={1.5} size={20} />
          </button>
        </Tooltip>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  const loginPage = { redirect: { destination: "/login", permanent: false } };

  if (!session) {
    return loginPage;
  }

  if (session.error === AuthError.RefreshTokenExpired) {
    return loginPage;
  }

  if (session.error === AuthError.RefreshAccessTokenError) {
    return loginPage;
  }

  spotifyApi.setAccessToken(session.accessToken as string);

  const [tracksResponse, artistsResponse] = await Promise.all([
    spotifyApi.getMyTopTracks({ limit: 50, time_range: TimeRange.Short }),
    spotifyApi.getMyTopArtists({ limit: 10, time_range: TimeRange.Short }),
  ]);

  return {
    props: {
      initialTopTracks: tracksResponse.body.items ?? [],
      initialTopArtists: artistsResponse.body.items ?? [],
    },
  };
}
