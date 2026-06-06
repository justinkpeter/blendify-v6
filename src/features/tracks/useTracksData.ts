import useTopTracks from "@/hooks/useTopTracks";
import { TimeRange } from "@/constants/timeRange";
import { CarouselTrackItem } from "@/components/ScrollCarousel/types";
import { toCarouselTrackItem } from "@/components/ScrollCarousel/carouselUtils";

export function useTracksData(initialTopTracks: SpotifyApi.TrackObjectFull[]) {
  const { topTracks, isLoading } = useTopTracks(
    TimeRange.Short,
    initialTopTracks,
  );

  const carouselItems: CarouselTrackItem[] =
    topTracks?.map(toCarouselTrackItem);

  return { carouselItems, isLoading };
}
