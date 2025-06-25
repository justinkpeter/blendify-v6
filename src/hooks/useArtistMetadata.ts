import { useEffect, useState } from "react";
import spotifyApi from "@/lib/spotify";

export function useArtistMetadata(
  selectedTrack: SpotifyApi.TrackObjectFull | null,
  isVisible: boolean
) {
  const [metadata, setMetadata] = useState<
    SpotifyApi.ArtistObjectFull[] | null
  >(null);
  const [genreList, setGenreList] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (selectedTrack && isVisible) {
        const artists = await Promise.all(
          selectedTrack.artists.map((artist) =>
            spotifyApi.getArtist(artist.id).then((res) => res.body)
          )
        );
        setMetadata(artists);

        const allGenres = artists.flatMap((artist) => artist.genres || []);
        const uniqueGenres = Array.from(new Set(allGenres));
        const topGenres = uniqueGenres.slice(0, 3);
        setGenreList(topGenres);
      } else {
        setMetadata(null);
        setGenreList([]);
      }
    };
    fetch();
  }, [selectedTrack, isVisible]);

  return { metadata, genreList };
}
