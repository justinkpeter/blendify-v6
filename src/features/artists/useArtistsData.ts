import { TimeRange } from "@/constants/timeRange";
import type { CarouselArtistItem } from "@/components/ScrollCarousel/types";
import { toCarouselArtistItem } from "@/components/ScrollCarousel/carouselUtils";
import useTopArtists from "@/hooks/useTopArtists";

export function useArtistsData(
  initialTopArtists: SpotifyApi.ArtistObjectFull[],
  initialTopTracks: SpotifyApi.TrackObjectFull[],
) {
  const { topArtists, isLoading } = useTopArtists(
    TimeRange.Short,
    initialTopArtists,
    initialTopTracks,
  );

  const carouselItems: CarouselArtistItem[] = (topArtists ?? []).map(
    toCarouselArtistItem,
  );

  return { carouselItems, isLoading };
}
