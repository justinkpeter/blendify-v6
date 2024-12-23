import { useEffect, useState } from "react";
import spotifyApi from "@/lib/spotify";
import { getSession } from "next-auth/react";

export type ArtistWithPreview = SpotifyApi.ArtistObjectFull & {
  previewUri: string | null;
};

export default function useTopArtists(
  timeRange: "short_term" | "medium_term" | "long_term",
  initialTopArtists: ArtistWithPreview[]
) {
  const [topArtists, setTopArtists] = useState(initialTopArtists);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTopArtists = async () => {
      setIsLoading(true);
      const session = await getSession();
      if (session) {
        spotifyApi.setAccessToken(session.accessToken as string);

        // Fetch top artists
        const response = await spotifyApi.getMyTopArtists({
          limit: 12,
          time_range: timeRange,
        });

        // Fetch preview URIs for each artist's top track
        const artistsWithPreview: ArtistWithPreview[] = await Promise.all(
          response.body.items.map(async (artist) => {
            try {
              const topTracksResponse = await spotifyApi.getArtistTopTracks(
                artist.id,
                "US"
              );
              const previewUri =
                topTracksResponse.body.tracks[0]?.preview_url || null;
              return { ...artist, previewUri };
            } catch {
              return { ...artist, previewUri: null };
            }
          })
        );

        setTopArtists(artistsWithPreview);
      }
      setIsLoading(false);
    };

    fetchTopArtists();
  }, [timeRange]);

  return { topArtists, isLoading };
}
