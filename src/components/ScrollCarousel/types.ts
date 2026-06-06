import { GenreItem } from "@/features/genres/genreUtils";

export type CarouselTrackItem = {
  kind: "track";
  track: SpotifyApi.TrackObjectFull;
};

export type CarouselArtistItem = {
  kind: "artist";
  artist: SpotifyApi.ArtistObjectFull & {
    topTrack?: CarouselTrackItem["track"];
  };
};

export type CarouselGenreItem = {
  kind: "genre";
  genre: GenreItem;
};
export type AnyCarouselItem =
  | CarouselTrackItem
  | CarouselArtistItem
  | CarouselGenreItem;
