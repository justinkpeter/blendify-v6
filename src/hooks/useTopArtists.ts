import { useEffect, useRef, useState } from "react";
import spotifyApi from "@/lib/spotify";
import { getSession } from "next-auth/react";
import { TimeRange } from "@/constants/timeRange";

export type ArtistWithTopTrack = SpotifyApi.ArtistObjectFull & {
  topTrack?: SpotifyApi.TrackObjectFull;
};

export default function useTopArtists(
  timeRange: TimeRange,
  initialTopArtists: SpotifyApi.ArtistObjectFull[],
  topTracks: SpotifyApi.TrackObjectFull[],
) {
  const [topArtists, setTopArtists] = useState<ArtistWithTopTrack[]>(
    enrichArtistsWithTracks(initialTopArtists, topTracks),
  );
  const [isLoading, setIsLoading] = useState(false);

  const topTracksRef = useRef(topTracks);
  useEffect(() => {
    topTracksRef.current = topTracks;
  }, [topTracks]);

  const topArtistsRef = useRef(topArtists);
  useEffect(() => {
    topArtistsRef.current = topArtists;
  }, [topArtists]);

  useEffect(() => {
    const fetchTopArtists = async () => {
      setIsLoading(true);
      const session = await getSession();
      if (!session) return;
      spotifyApi.setAccessToken(session.accessToken as string);
      const response = await spotifyApi.getMyTopArtists({
        limit: 12,
        time_range: timeRange,
      });
      setTopArtists(
        enrichArtistsWithTracks(response.body.items, topTracksRef.current),
      );
      setIsLoading(false);
    };

    fetchTopArtists();
  }, [timeRange]);

  useEffect(() => {
    const topArtists = topArtistsRef.current;
    if (!topArtists || topArtists.length === 0) return;

    const missingArtists = topArtists.filter((a) => !a.topTrack);
    if (missingArtists.length === 0) return;

    const fetchMissingTracks = async () => {
      const session = await getSession();
      if (!session) return;
      spotifyApi.setAccessToken(session.accessToken as string);

      const filled = await Promise.all(
        missingArtists.map(async (artist) => {
          const res = await spotifyApi.getArtistTopTracks(artist.id, "US");
          return { ...artist, topTrack: res.body.tracks[0] };
        }),
      );

      setTopArtists((prev) =>
        prev.map((artist) => {
          const updated = filled.find((a) => a.id === artist.id);
          return updated ?? artist;
        }),
      );
    };

    fetchMissingTracks();
  }, [topArtists.length]);

  return { topArtists, isLoading };
}

function enrichArtistsWithTracks(
  artists: SpotifyApi.ArtistObjectFull[],
  tracks: SpotifyApi.TrackObjectFull[],
): ArtistWithTopTrack[] {
  if (!artists || !tracks) return [];
  return artists.map((artist) => ({
    ...artist,
    topTrack: tracks.find((track) =>
      track.artists.some((a) => a.id === artist.id),
    ),
  }));
}
