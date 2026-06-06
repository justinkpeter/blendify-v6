import { useCallback, useEffect, useState } from "react";
import {
  AnyCarouselItem,
  CarouselTrackItem,
  CarouselArtistItem,
  CarouselGenreItem,
} from "@/components/ScrollCarousel/types";

export function useHomeState(
  trackItems: CarouselTrackItem[],
  artistItems: CarouselArtistItem[],
  genreItems: CarouselGenreItem[],
) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<AnyCarouselItem | null>(null);

  const getDefaultItem = useCallback(
    (index: number): AnyCarouselItem | null => {
      if (index === 0) return trackItems[0] ?? null;
      if (index === 1) return artistItems[0] ?? null;
      if (index === 2) return genreItems[0] ?? null;
      return null;
    },
    [trackItems, artistItems, genreItems],
  );

  const handleTabClick = useCallback(
    (index: number) => {
      setActiveTabIndex(index);
      setActiveItem(getDefaultItem(index));
    },
    [getDefaultItem],
  );

  const handleActiveItemChange = useCallback((item: AnyCarouselItem) => {
    setActiveItem(item);
  }, []);

  useEffect(() => {
    if (activeItem) return;
    setActiveItem(getDefaultItem(activeTabIndex));
  }, [
    trackItems,
    artistItems,
    genreItems,
    activeTabIndex,
    activeItem,
    getDefaultItem,
  ]);

  return {
    activeTabIndex,
    isPanelOpen,
    setIsPanelOpen,
    activeItem,
    handleTabClick,
    handleActiveItemChange,
  };
}
