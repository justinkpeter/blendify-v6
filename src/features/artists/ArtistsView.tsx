import { ReactNode } from "react";
import ScrollCarousel from "@/components/ScrollCarousel/ScrollCarousel";
import type { CarouselArtistItem } from "@/components/ScrollCarousel/types";

interface ArtistsViewProps {
  carouselItems: CarouselArtistItem[];
  isLoading: boolean;
  metaPanel?: ReactNode;
  onActiveItemChange?: (item: CarouselArtistItem) => void;
}

export default function ArtistsView({
  carouselItems,
  isLoading,
  metaPanel,
  onActiveItemChange,
}: ArtistsViewProps) {
  if (isLoading || carouselItems.length === 0) return null;

  return (
    <ScrollCarousel
      items={carouselItems}
      metaPanel={metaPanel}
      onActiveItemChange={onActiveItemChange}
    />
  );
}
