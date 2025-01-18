import React, { useState } from "react";
import spotifyApi from "@/lib/spotify";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import styles from "@/styles/pages/genres.module.scss";
import Filters, { FilterValue } from "@/components/Filters/Filters";
import useTopGenres from "@/hooks/useTopGenres";
import { PieChart } from "@/components/PieChart/PieChart";
import useRecommendations from "@/hooks/useRecommendations";
import GenreList from "@/components/Genres/GenreList";
import Recommendations from "@/components/Genres/Recommendations";
import SelectedRecommendation from "@/components/Genres/SelectedRecommendation";
import useSelectedGenre from "@/components/Genres/useSelectedGenre";

type GenrePercentage = { genre: string; percentage: number };

export default function Genres({
  initialTopGenres,
}: {
  initialTopGenres: GenrePercentage[];
}) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("short_term");

  const { topGenres, topTrackIds } = useTopGenres(
    activeFilter,
    initialTopGenres
  );

  const { recommendations } = useRecommendations(
    topGenres,
    activeFilter,
    topTrackIds
  );

  const {
    selectedGenreIndex,
    selectedRecIndex,
    handleSelectGenre,
    handleSelectRecommendation,
  } = useSelectedGenre();

  return (
    <main className={styles.genres}>
      <header className={styles.genres__header}>
        <h1>your genres</h1>
        <div>
          <span>
            we know you&apos;re an audiophile, but specifically what kind?
          </span>
        </div>
      </header>
      <div className={styles.genres__filters}>
        <Filters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>
      <section className={styles.genres__info}>
        <div>
          <GenreList
            topGenres={topGenres}
            activeFilter={activeFilter}
            onHover={handleSelectGenre}
          />
          <Recommendations
            recommendations={recommendations}
            selectedIndex={selectedRecIndex}
            onSelect={handleSelectRecommendation}
          />
          <SelectedRecommendation
            recommendation={
              selectedRecIndex !== null
                ? recommendations[selectedRecIndex]
                : null
            }
          />
        </div>
        <div className={styles.genres__chart}>
          <PieChart
            data={topGenres.reduce((acc, { genre, percentage }) => {
              acc[genre] = percentage;
              return acc;
            }, {} as Record<string, number>)}
            width={450}
            height={450}
            selectedIndex={selectedGenreIndex}
          />
        </div>
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

  const topGenres = await calculateTopGenres("short_term");

  return { props: { initialTopGenres: topGenres } };
}

async function fetchTopArtists(
  timeRange: "short_term" | "medium_term" | "long_term"
) {
  const data = await spotifyApi.getMyTopArtists({
    limit: 50,
    time_range: timeRange,
  });

  return data.body.items;
}

async function fetchGenresForArtists(artists: SpotifyApi.ArtistObjectFull[]) {
  const artistIds = artists.map((artist) => artist.id);

  // Spotify allows batch requests for up to 50 artists
  const data = await spotifyApi.getArtists(artistIds);

  const genreCount: Record<string, number> = {};

  // Count genres
  data.body.artists.forEach((artist) => {
    artist.genres.forEach((genre) => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });

  return genreCount;
}

async function calculateTopGenres(
  timeRange: "short_term" | "medium_term" | "long_term"
) {
  const topArtists = await fetchTopArtists(timeRange);
  const genreCount = await fetchGenresForArtists(topArtists);

  // Calculate the total number of genres
  const totalGenres = Object.values(genreCount).reduce(
    (sum, count) => sum + count,
    0
  );

  // Calculate percentages and sort
  const genrePercentages: GenrePercentage[] = Object.entries(genreCount).map(
    ([genre, count]) => ({
      genre,
      percentage: (count / totalGenres) * 100,
    })
  );

  return genrePercentages
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10); // Top 10 genres
}
