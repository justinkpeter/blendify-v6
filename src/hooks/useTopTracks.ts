import { useEffect, useState } from "react";
import spotifyApi from "@/lib/spotify";
import { getSession } from "next-auth/react";

export default function useTopTracks(
  timeRange: "short_term" | "medium_term" | "long_term",
  initialTopTracks: SpotifyApi.TrackObjectFull[]
) {
  const [topTracks, setTopTracks] = useState(initialTopTracks);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTopTracks = async () => {
      setIsLoading(true);
      const session = await getSession();
      if (session) {
        spotifyApi.setAccessToken(session.accessToken as string);
        const response = await spotifyApi.getMyTopTracks({
          limit: 12,
          time_range: timeRange,
        });
        setTopTracks(response.body.items);
      }
      setIsLoading(false);
    };

    fetchTopTracks();
  }, [timeRange]);

  return { topTracks, isLoading };
}
