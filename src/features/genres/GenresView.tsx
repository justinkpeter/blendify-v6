import { ReactNode } from "react";
import ScrollCarousel from "@/components/ScrollCarousel/ScrollCarousel";
import {
  CarouselGenreItem,
  AnyCarouselItem,
} from "@/components/ScrollCarousel/types";

interface GenresViewProps {
  genreItems: CarouselGenreItem[];
  metaPanel?: ReactNode;
  onActiveItemChange?: (item: AnyCarouselItem) => void;
}

export default function GenresView({
  genreItems,
  metaPanel,
  onActiveItemChange,
}: GenresViewProps) {
  if (genreItems.length === 0) return null;

  return (
    <ScrollCarousel
      items={genreItems}
      metaPanel={metaPanel}
      onActiveItemChange={onActiveItemChange}
    />
  );
}
