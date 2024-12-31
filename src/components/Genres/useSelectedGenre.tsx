import { useState } from "react";

export default function useSelectedGenre() {
  const [selectedGenreIndex, setSelectedGenreIndex] = useState<number | null>(
    null
  );
  const [selectedRecIndex, setSelectedRecIndex] = useState<number | null>(null);

  const handleSelectGenre = (index: number | null) => {
    setSelectedGenreIndex(index);
  };

  /* handles the selection of a recommendation */
  const handleSelectRecommendation = (index: number) => {
    if (index === selectedRecIndex) {
      setSelectedRecIndex(null);
      return;
    }

    setSelectedRecIndex(index);
  };

  return {
    selectedGenreIndex,
    selectedRecIndex,
    handleSelectGenre,
    handleSelectRecommendation,
  };
}
