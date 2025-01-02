import { useEffect, useState } from "react";
import spotifyApi from "@/lib/spotify";
import { getSession } from "next-auth/react";

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

const GENRE_MAPPING: { [key: string]: string } = {
  rap: "rap",
  "hip-hop": "hip-hop",
  "r&b": "r&b", // Keep 'r&b' as is
  pop: "pop",
  plugg: "plugg",
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

export default function useRecommendations(
  genres: Genre[],
  topTrackIds?: string[]
) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (genres.length === 0) return;

    const fetchRecommendations = async () => {
      setIsLoading(true);
      const session = await getSession();

      if (session) {
        spotifyApi.setAccessToken(session.accessToken as string);

        try {
          // Extract genre names, limit to top 5 based on percentage
          const topGenres = genres
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5)
            .map((g) => mapGenre(g.genre.toLowerCase()));

          // Convert the array to a comma-separated string
          const seedGenres = topGenres.join(",");

          console.log(seedGenres); // Debug output

          // Query Spotify recommendations
          const response = await spotifyApi.getRecommendations({
            // seed_genres: seedGenres,
            seed_tracks: topTrackIds?.join(",") || "",
            limit: 5,
          });

          // Format the recommendations
          const formattedRecommendations = response.body.tracks.map(
            (track) => ({
              id: track.id,
              name: track.name,
              artists: track.artists.map((artist) => {
                return {
                  name: artist.name,
                  uri: artist.uri,
                };
              }),
              album: track.album.name,
              albumArt: track.album.images[0]?.url,
              preview: track.preview_url,
              uri: track.uri,
            })
          );

          setRecommendations(formattedRecommendations);
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      }

      setIsLoading(false);
    };

    fetchRecommendations();
  }, [genres, topTrackIds]);

  return { recommendations, isLoading };
}
