import { useEffect, useState, useCallback, useMemo } from "react";
import spotifyApi from "@/lib/spotify";
import { getSession } from "next-auth/react";
import { FilterValue } from "@/components/Filters/Filters";

interface Genre {
  genre: string;
  percentage: number;
}

interface Recommendation {
  id: string;
  name: string;
  artists: {
    name: string;
    uri: string;
  }[];
  album: string;
  albumArt: string;
  preview: string | null;
  uri: string;
}

// const GENRE_MAPPING: { [key: string]: string } = {
//   rap: "rap",
//   "hip-hop": "hip-hop",
//   "r&b": "r&b", // Keep 'r&b' as is
//   pop: "pop",
//   plugg: "plugg",
// };

// function mapGenre(genre: string): string {
//   // Map genre to its category or default to itself
//   for (const keyword in GENRE_MAPPING) {
//     if (genre.toLowerCase().includes(keyword)) {
//       return GENRE_MAPPING[keyword];
//     }
//   }
//   return genre;
// }

export default function useRecommendations(
  genres: Genre[],
  activeFilter: FilterValue,
  topTrackIds?: string[]
) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    if (genres.length === 0) return;
    if (!topTrackIds?.length) return;

    setIsLoading(true);
    const session = await getSession();

    if (session) {
      spotifyApi.setAccessToken(session.accessToken as string);

      try {
        // Extract genre names, limit to top 5 based on percentage
        // const topGenres = genres
        //   .sort((a, b) => b.percentage - a.percentage)
        //   .slice(0, 5)
        //   .map((g) => mapGenre(g.genre.toLowerCase()));

        // Convert the array to a comma-separated string
        // const seedGenres = topGenres.join(",");

        // Query Spotify recommendations
        const response = await spotifyApi.getRecommendations({
          seed_tracks: topTrackIds?.join(","),
          limit: 5,
        });

        // Format the recommendations
        const formattedRecommendations = response.body.tracks.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map((artist) => ({
            name: artist.name,
            uri: artist.uri,
          })),
          album: track.album.name,
          albumArt: track.album.images[0]?.url,
          preview: track.preview_url,
          uri: track.uri,
        }));

        setRecommendations(formattedRecommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        if (!topTrackIds?.length) {
          console.log("No top tracks found");
        }
      }
    }

    setIsLoading(false);
  }, [activeFilter]);

  useEffect(() => {
    fetchRecommendations();
  }, [activeFilter]);

  return useMemo(
    () => ({ recommendations, isLoading }),
    [recommendations, isLoading]
  );
}
