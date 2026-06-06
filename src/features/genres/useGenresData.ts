import { useMemo } from "react";
import { ArtistWithTopTrack } from "@/hooks/useTopArtists";
import { buildGenreItems } from "./genreUtils";
import { toCarouselGenreItem } from "@/components/ScrollCarousel/carouselUtils";
import { CarouselGenreItem } from "@/components/ScrollCarousel/types";

export function useGenresData(
  topArtists: ArtistWithTopTrack[],
  topTracks: SpotifyApi.TrackObjectFull[],
): { genreItems: CarouselGenreItem[] } {
  const genreItems = useMemo(
    () => buildGenreItems(topArtists, topTracks).map(toCarouselGenreItem),
    [topArtists, topTracks],
  );

  return { genreItems };
}
