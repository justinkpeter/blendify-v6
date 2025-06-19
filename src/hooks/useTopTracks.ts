import { useEffect, useState } from "react";
import spotifyApi from "@/lib/spotify";
import { getSession } from "next-auth/react";
import { TimeRange } from "@/constants/timeRange";

export default function useTopTracks(
  timeRange: TimeRange,
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
