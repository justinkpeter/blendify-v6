import { useState } from "react";

/** Hook to manage the selected artist state, its visibility, and UI-related interactions. */
export default function useSelectedArtist() {
  /** The currently selected Spotify artist, or null if none is selected. */
  const [selectedArtist, setSelectedArtist] =
    useState<SpotifyApi.ArtistObjectFull | null>(null);

  /** Whether the selected artist detail view/modal is currently visible. */
  const [isVisible, setIsVisible] = useState(false);

  /** Index of the currently hovered artist in the carousel. */
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  /** Selects an artist and sets the detail view to visible.
   * @param artist - The Spotify artist to be selected.
   */
  const handleArtistSelection = (artist: SpotifyApi.ArtistObjectFull) => {
    setSelectedArtist(artist);
    setIsVisible(true);
  };

  /** Closes the detail view without clearing the selected artist. */
  const handleCloseArtist = () => setIsVisible(false);

  return {
    selectedArtist,
    isArtistVisible: isVisible,
    hoveredIndex,
    setHoveredIndex,
    handleArtistSelection,
    handleCloseArtist,
  };
}
