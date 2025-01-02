import { useEffect, useState } from "react";
import spotifyApi from "@/lib/spotify";
import { getSession } from "next-auth/react";

type GenrePercentage = {
  genre: string;
  percentage: number;
};

// Genre Mapping: Define how to group genres
const GENRE_MAPPING: Record<string, string> = {
  "r&b": "R&B",
  "alternative r&b": "R&B",
  pop: "Pop",
  "indie pop": "Pop",
  "hip hop": "Hip-Hop",
  "alternative hip hop": "Hip-Hop",
  rap: "Rap",
  "chicago rap": "Rap",
  drill: "Drill",
};

function mapGenre(genre: string): string {
  // Map genre to its category or default to itself
  for (const keyword in GENRE_MAPPING) {
    if (genre.toLowerCase().includes(keyword)) {
      return GENRE_MAPPING[keyword];
    }
  }
  return genre;
}

export default function useTopGenres(
  timeRange: "short_term" | "medium_term" | "long_term",
  initialTopGenres: GenrePercentage[]
) {
  const [topGenres, setTopGenres] =
    useState<GenrePercentage[]>(initialTopGenres);
  const [topTrackIds, setTopTrackIds] = useState<string[]>([]);
  const [artistIds, setArtistIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTopGenres = async () => {
      setIsLoading(true);
      const session = await getSession();

      if (session) {
        spotifyApi.setAccessToken(session.accessToken as string);

        // Fetch top tracks
        const topTracks = await spotifyApi
          .getMyTopTracks({ limit: 5, time_range: timeRange })
          .then((data) => data.body.items);

        // Extract track IDs and artist IDs
        const trackIds = topTracks.map((track) => track.id);
        setTopTrackIds(trackIds); // Save track IDs to state

        const artistIds = new Set(
          topTracks.flatMap((track) => track.artists.map((artist) => artist.id))
        );
        setArtistIds(artistIds);

        // Fetch genres for each artist
        const artistDetails = await spotifyApi
          .getArtists(Array.from(artistIds))
          .then((data) => data.body.artists);

        // Count genre occurrences with mapping
        const genreCount: Record<string, number> = {};
        artistDetails.forEach((artist) => {
          artist.genres.forEach((genre) => {
            const mappedGenre = mapGenre(genre); // Map the genre
            genreCount[mappedGenre] = (genreCount[mappedGenre] || 0) + 1;
          });
        });

        // Calculate total genres and percentages
        const totalGenres = Object.values(genreCount).reduce(
          (sum, count) => sum + count,
          0
        );

        const genrePercentages = Object.entries(genreCount).map(
          ([genre, count]) => ({
            genre,
            percentage: (count / totalGenres) * 100,
          })
        );

        // Sort genres by percentage in descending order
        const sortedGenres = genrePercentages.sort(
          (a, b) => b.percentage - a.percentage
        );

        // Normalize the top 6 genres
        const normalizedGenres = normalizePercentages(sortedGenres);

        setTopGenres(normalizedGenres); // Set normalized top genres
      }

      setIsLoading(false);
    };

    fetchTopGenres();
  }, [timeRange]);

  return { topGenres, topTrackIds, isLoading };
}

// Normalization function
const normalizePercentages = (topGenres: GenrePercentage[]) => {
  // Take the top 6 genres
  const topSix = topGenres.slice(0, 6);

  // Calculate the total percentage of the top 6
  const totalPercentage = topSix.reduce(
    (sum, genre) => sum + genre.percentage,
    0
  );

  // Normalize each percentage
  const normalizedGenres = topSix.map((genre) => ({
    genre: genre.genre,
    percentage: parseFloat(
      ((genre.percentage / totalPercentage) * 100).toFixed(1)
    ),
  }));

  return normalizedGenres;
};
