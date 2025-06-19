import { useState } from "react";

/** Hook to manage the selected track state, its visibility, and UI-related interactions. */
export function useSelectedTrack() {
  /** The currently selected Spotify track, or null if none is selected.*/
  const [selectedTrack, setSelectedTrack] =
    useState<SpotifyApi.TrackObjectFull | null>(null);

  /** Whether the selected track detail view/modal is currently visible. */
  const [isVisible, setIsVisible] = useState(false);

  /** Index of the currently hovered track in the carousel. */
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  /** Selects a track and sets the detail view to visible.
   * @param track - The Spotify track to be selected.
   */
  const handleTrackSelection = (track: SpotifyApi.TrackObjectFull) => {
    setSelectedTrack(track);
    setIsVisible(true);
  };

  /** Closes the detail view without clearing the selected track. */
  const handleCloseTrack = () => setIsVisible(false);

  /** Resets the hovered track index back to 0. */
  const resetHoveredIndex = () => setHoveredIndex(0);

  return {
    selectedTrack,
    /** Whether the selected track view is visible */
    isTrackVisible: isVisible,
    hoveredIndex,
    setHoveredIndex,
    handleTrackSelection,
    /** Hides the selected track view */
    handleCloseTrack,
    /** Resets the hovered index to 0 */
    resetHoveredIndex,
  };
}
