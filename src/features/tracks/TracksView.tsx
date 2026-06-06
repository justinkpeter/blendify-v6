import { ReactNode } from "react";
import ScrollCarousel from "@/components/ScrollCarousel/ScrollCarousel";
import { CarouselTrackItem } from "@/components/ScrollCarousel/types";

interface TracksViewProps {
  carouselItems: CarouselTrackItem[];
  isLoading: boolean;
  metaPanel?: ReactNode;
  onActiveItemChange?: (item: CarouselTrackItem) => void;
}

export default function TracksView({
  carouselItems,
  isLoading,
  metaPanel,
  onActiveItemChange,
}: TracksViewProps) {
  if (isLoading || carouselItems?.length === 0) return null;

  return (
    <ScrollCarousel
      items={carouselItems}
      metaPanel={metaPanel}
      onActiveItemChange={onActiveItemChange}
    />
  );
}
