import { useEffect, useState } from "react";
import spotifyApi from "@/lib/spotify";
import { getSession } from "next-auth/react";

export default function useTopArtists(
  timeRange: "short_term" | "medium_term" | "long_term",
  initialTopArtists: SpotifyApi.ArtistObjectFull[]
) {
  const [topArtists, setTopArtists] = useState(initialTopArtists);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTopArtists = async () => {
      setIsLoading(true);
      const session = await getSession();
      if (session) {
        spotifyApi.setAccessToken(session.accessToken as string);
        const response = await spotifyApi.getMyTopArtists({
          limit: 12,
          time_range: timeRange,
        });
        setTopArtists(response.body.items);
      }
      setIsLoading(false);
    };

    fetchTopArtists();
  }, [timeRange]);

  return { topArtists, isLoading };
}
