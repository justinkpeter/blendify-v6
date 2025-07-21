import spotifyApi from "@/lib/spotify";
import { useEffect, useState, useRef } from "react";

/** Extended metadata for an artist*/
export interface ArtistProfile {
  topTracks: SpotifyApi.TrackObjectFull[];
  albumCount: number;
  singleCount: number;
  epCount: number;
  latestRelease: SpotifyApi.AlbumObjectSimplified | null;
}

/*** Represents the state of the data fetching process */
type Status = "idle" | "loading" | "success" | "error";

/**
 * Custom hook to fetch extended metadata for a given Spotify artist.
 *
 * This hook fetches:
 * - Top tracks
 * - Album/single/EP counts
 * - Most recent release
 *
 * It includes an in-memory cache and only fetches data when the artist is visible.
 *
 * @param isArtistVisible - Boolean indicating if the artist details are currently visible in the UI.
 * @param artistId - Spotify ID of the artist.
 * @returns An object containing:
 *  - `data`: ArtistDetails or null
 *  - `loading`: Boolean indicating loading state
 *  - `error`: Boolean indicating error state
 */
export default function useArtistDetails(
  isArtistVisible: boolean,
  artistId?: SpotifyApi.ArtistObjectFull["id"]
) {
  const [data, setData] = useState<ArtistProfile | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  // In-memory cache keyed by artist ID to avoid redundant API calls
  const cache = useRef<Map<string, ArtistProfile>>(new Map());

  useEffect(() => {
    if (!artistId || !isArtistVisible) {
      setData(null);
      setStatus("idle");
      return;
    }

    async function fetchArtistDetails(id: string) {
      // Use cached result if available
      if (cache.current.has(id)) {
        setData(cache.current.get(id)!);
        setStatus("success");
        return;
      }

      setStatus("loading");

      try {
        // Fetch top tracks and albums concurrently
        const [tracksRes, albumsRes] = await Promise.all([
          spotifyApi.getArtistTopTracks(id, "US"),
          spotifyApi.getArtistAlbums(id, { limit: 50 }),
        ]);

        const tracksData = tracksRes.body.tracks;
        const albumsData = albumsRes.body.items;

        if (!tracksData || !albumsData) {
          throw new Error("Invalid Spotify API response");
        }

        // Count different types of releases
        const albumGroups: Record<string, number> = {};
        for (const album of albumsData) {
          const group = album.album_group ?? "other";
          if (!albumGroups[group]) {
            albumGroups[group] = 0;
          }
          albumGroups[group] += 1;
        }

        // Find the most recent release
        const sortedAlbums = albumsData
          .filter((album) => album.release_date)
          .sort(
            (a, b) =>
              new Date(b.release_date).getTime() -
              new Date(a.release_date).getTime()
          );

        const latestRelease = sortedAlbums[0] || null;

        const parsed: ArtistProfile = {
          topTracks: tracksData,
          albumCount: albumGroups.album || 0,
          singleCount: albumGroups.single || 0,
          epCount: albumGroups.ep || 0,
          latestRelease,
        };

        cache.current.set(id, parsed);
        setData(parsed);
        setStatus("success");
      } catch (error) {
        console.error("Failed to fetch artist details", error);
        setStatus("error");
        setData(null);
      }
    }

    fetchArtistDetails(artistId);
  }, [artistId, isArtistVisible]);

  return {
    data,
    loading: status === "loading",
    error: status === "error",
  };
}
