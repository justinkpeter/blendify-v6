import React, { useState } from "react";
import { motion } from "framer-motion";
import spotifyApi from "@/lib/spotify";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import styles from "@/styles/pages/genres.module.scss";
import Filters, { FilterValue } from "@/components/Filters/Filters";
import useTopGenres from "@/hooks/useTopGenres";
import { PieChart } from "@/components/PieChart/PieChart";
import useRecommendations from "@/hooks/useRecommendations";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";

type GenrePercentage = { genre: string; percentage: number };

export default function Genres({
  initialTopGenres,
}: {
  initialTopGenres: GenrePercentage[];
}) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("short_term");
  const {
    topGenres,
    isLoading: isLoadingGenres,
    topTrackIds,
  } = useTopGenres(activeFilter, initialTopGenres);
  const { recommendations, isLoading: isLoadingRecs } = useRecommendations(
    topGenres,
    topTrackIds
  );

  const [selectedRecIndex, setSelectedRecIndex] = useState<number | null>(null);

  const handleSelectRecommendation = (index: number) => {
    setSelectedRecIndex(index); // Set the selected index
  };

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
      <div className={styles.genres__info}>
        {isLoadingGenres ? (
          <div>Loading genres...</div> // Show loading state for genres
        ) : (
          <>
            <span>{topGenres[0].genre} goes hard</span>
            <div>
              This genre appears in {topGenres[0].percentage.toFixed(0)}% of
              your top 50 songs you&apos;ve listened to in the last 4 weeks.
            </div>
            <ol>
              {topGenres.map((genre) => (
                <li key={genre.genre}>
                  <div>
                    <span>{genre.genre}</span>
                    <span>{genre.percentage}%</span>
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
        <div>
          <hr />
          <br />
          <br />
          songs you might like based on your recent vibes:
          <br />
          <br />
          <div className={styles.recs}>
            {isLoadingRecs ? (
              <div>Loading recommendations...</div> // Show loading state for recommendations
            ) : (
              <>
                {recommendations.map((rec, i) => (
                  <motion.div
                    key={rec.id}
                    className={styles.rec}
                    onClick={() => handleSelectRecommendation(i)} // Handle click to select a rec
                    initial={{ opacity: 0 }} // Animation starting state
                    animate={{ opacity: 1 }} // Animation end state
                    transition={{ duration: 0.1 }} // Transition duration
                    whileHover={{ scale: 1.05 }} // Hover effect
                  >
                    <img
                      src={rec.albumArt}
                      alt={rec.name}
                      title={rec.name}
                      className={selectedRecIndex === i ? styles.selected : ""}
                    />
                  </motion.div>
                ))}
                {selectedRecIndex !== null && (
                  <div className={styles.rec}>
                    {/* Add more details about the selected recommendation */}
                    <a href={recommendations[selectedRecIndex].uri}>
                      <h3>{recommendations[selectedRecIndex].name}</h3>
                    </a>
                    <p>
                      {recommendations[selectedRecIndex].artists.map(
                        (artist, index) => (
                          <span key={index}>
                            <a href={artist.uri}>{artist.name}</a>
                            {index <
                            recommendations[selectedRecIndex].artists.length - 1
                              ? ","
                              : ""}
                          </span>
                        )
                      )}
                    </p>
                    <div>
                      <AudioPlayer
                        src={recommendations[selectedRecIndex].preview}
                      />
                      <img
                        src={"/img/spotify-icon-white.png"}
                        className={styles.icon}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <section className={styles.genres__chart}>
        <PieChart
          data={topGenres.reduce((acc, { genre, percentage }) => {
            acc[genre] = percentage;
            return acc;
          }, {} as Record<string, number>)}
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
