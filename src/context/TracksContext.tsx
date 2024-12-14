import React, { createContext, useContext, useState } from "react";
import { FilterOption } from "@/components/Filters/Filters";

export interface TracksContextValue {
  activeFilter: FilterOption;
  setActiveFilter: (filter: FilterOption) => void;
  selectedTrack: SpotifyApi.TrackObjectFull | null;
  setSelectedTrack: (track: SpotifyApi.TrackObjectFull | null) => void;
}

const TracksContext = createContext<TracksContextValue | undefined>(undefined);

export const TracksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>({
    label: "year",
    value: "long_term",
  });
  const [selectedTrack, setSelectedTrack] =
    useState<SpotifyApi.TrackObjectFull | null>(null);

  return (
    <TracksContext.Provider
      value={{ activeFilter, setActiveFilter, selectedTrack, setSelectedTrack }}
    >
      {children}
    </TracksContext.Provider>
  );
};

export const useTracksContext = () => {
  const context = useContext(TracksContext);
  if (!context) {
    throw new Error("useTracksContext must be used within TracksProvider");
  }
  return context;
};
