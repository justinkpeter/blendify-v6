import {
  AnyCarouselItem,
  CarouselArtistItem,
  CarouselGenreItem,
  CarouselTrackItem,
} from "./types";
import { GenreItem } from "@/features/genres/genreUtils";

// --- Type Guards ---
export function isTrackItem(item: AnyCarouselItem) {
  return item.kind === "track";
}
export function isArtistItem(
  item: AnyCarouselItem,
): item is CarouselArtistItem {
  return item.kind === "artist";
}
export function isGenreItem(item: AnyCarouselItem) {
  return item.kind === "genre";
}

// --- Selectors ---
export function getCarouselItemName(item: AnyCarouselItem): string {
  switch (item.kind) {
    case "track":
      return item.track.name;
    case "artist":
      return item.artist.name;
    case "genre":
      return item.genre.genre;
  }
}

export function getCarouselItemImageSrc(item: AnyCarouselItem): string {
  switch (item.kind) {
    case "track":
      return item.track.album.images[0]?.url ?? "";
    case "artist":
      return item.artist.images[0]?.url ?? "";
    case "genre":
      return item.genre.topTrack?.album.images[0]?.url ?? "";
  }
}

export function getCarouselItemId(item: AnyCarouselItem): string {
  switch (item.kind) {
    case "track":
      return item.track.id;
    case "artist":
      return item.artist.id;
    case "genre":
      return item.genre.genre; // genre name as stable ID
  }
}

export function getArtistTopTrack(
  item: CarouselArtistItem,
): CarouselTrackItem | null {
  return item.artist.topTrack
    ? toCarouselTrackItem(item.artist.topTrack)
    : null;
}

// --- Constructors ---
export function toCarouselTrackItem(
  track: CarouselTrackItem["track"],
): CarouselTrackItem {
  return { kind: "track", track };
}

export function toCarouselArtistItem(
  artist: CarouselArtistItem["artist"],
): CarouselArtistItem {
  return { kind: "artist", artist };
}

export function toCarouselGenreItem(genre: GenreItem): CarouselGenreItem {
  return { kind: "genre", genre };
}
