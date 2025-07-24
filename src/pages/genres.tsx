import React from "react";
import spotifyApi from "@/lib/spotify";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import styles from "@/styles/pages/genres.module.scss";
import Page from "@/components/Page";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import clsx from "clsx";

interface TopGenre {
  genre: string;
  percentage: number;
}
export default function Genres({ genres }: { genres: TopGenre[] }) {
  const topGenre = genres[0].genre;
  const topGenrePercentage = genres[0].percentage;
  return (
    <Page className={styles.genres}>
      <div className={styles.genres__title}>your recent vibes</div>
      <div className={styles.genres__container}>
        <div className={styles.genres__icon}>
          <MusicalNoteIcon />
        </div>
        <div className={styles.genres__topGenre}>
          <span>{topGenre}</span>
          goes hard.
        </div>
        <div className={styles.genres__description}>
          Looks like you&apos;re a huge {topGenre} fan! This genre appears in{" "}
          <span className={styles.genres__coloredText}>
            {topGenrePercentage.toFixed(0)}%
          </span>{" "}
          of your top 50 tracks you&apos;ve listened to in the last 4 weeks.
          These are the vibes you’ve been feeling lately.
        </div>
        <div className={styles.genres__data}>
          {genres.map(({ genre }, index) => (
            <div key={genre} className={styles.genres__bar} title={genre}>
              <div className={styles.genres__label}>{genre}</div>
              <div className={styles.genres__barContainer}>
                <motion.div
                  className={clsx(
                    styles.genres__barFill,
                    styles[`barFill--${index}`]
                  )}
                  style={{ width: `${genres[index].percentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${genres[index].percentage}%` }}
                  transition={{
                    duration: 1.5,
                    delay: index * 0.2,
                    ease: "easeOut",
                  }}
                />
                <motion.div className={styles.genres__barPercentage}>
                  {genres[index].percentage}%
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session || !session.accessToken || !session.refreshToken) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  spotifyApi.setAccessToken(session.accessToken as string);
  spotifyApi.setRefreshToken(session.refreshToken as string);

  try {
    // 1. Get top tracks
    const topTracksResponse = await spotifyApi.getMyTopTracks({
      limit: 50,
      time_range: "short_term",
    });

    const topTracks = topTracksResponse.body.items;
    if (!topTracks || topTracks.length === 0) {
      return { props: { topGenres: [] } };
    }

    // 2. Get all artist IDs
    const artistIds = topTracks.flatMap((track) =>
      track.artists.map((artist) => artist.id)
    );
    const uniqueArtistIds = Array.from(new Set(artistIds));

    // 3. Batch artist requests
    const batchSize = 50;
    const artistChunks = [];

    for (let i = 0; i < uniqueArtistIds.length; i += batchSize) {
      artistChunks.push(uniqueArtistIds.slice(i, i + batchSize));
    }

    const artists: SpotifyApi.ArtistObjectFull[] = [];

    for (const chunk of artistChunks) {
      const response = await spotifyApi.getArtists(chunk);
      artists.push(...response.body.artists);
    }

    // 4. Build genre frequency map
    const genreFrequency: Record<string, number> = {};
    for (const artist of artists) {
      for (const genre of artist.genres) {
        genreFrequency[genre] = (genreFrequency[genre] || 0) + 1;
      }
    }

    const total = Object.values(genreFrequency).reduce((a, b) => a + b, 0);

    const topGenres = Object.entries(genreFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({
        genre,
        percentage: parseFloat(((count / total) * 100).toFixed(0)),
      }));

    return {
      props: {
        genres: topGenres,
      },
    };
  } catch (err) {
    console.error("Error fetching genres:", err);
    return {
      props: {
        topGenres: [],
        error: true,
      },
    };
  }
}
