export enum PopularityTier {
  HiddenGem = "hidden gem",
  CultClassic = "cult classic",
  OnTheRise = "on the rise",
  HeavyOnTheRadio = "heavy on the radio",
  Mainstream = "mainstream",
  Iconic = "iconic",
}

export function getPopularityTier(popularity: number): PopularityTier {
  if (popularity < 10) return PopularityTier.HiddenGem;
  if (popularity < 25) return PopularityTier.CultClassic;
  if (popularity < 40) return PopularityTier.OnTheRise;
  if (popularity < 60) return PopularityTier.HeavyOnTheRadio;
  if (popularity < 80) return PopularityTier.Mainstream;
  return PopularityTier.Iconic;
}

export function getPopularityTierColor(tier: PopularityTier): string {
  switch (tier) {
    case PopularityTier.HiddenGem:
      return "#aaa";
    case PopularityTier.CultClassic:
      return "#888";
    case PopularityTier.OnTheRise:
      return "#f0a500";
    case PopularityTier.HeavyOnTheRadio:
      return "#e07b00";
    case PopularityTier.Mainstream:
      return "#1db954";
    case PopularityTier.Iconic:
      return "#1db954";
  }
}

export function getAlbumReleaseDate(
  releaseDate: string | undefined,
): string | undefined {
  return releaseDate
    ? new Date(releaseDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : undefined;
}

export function getListeningStyle(trackCount: number): string {
  if (trackCount === 0) return "Album listener";
  if (trackCount === 1) return "Selective";
  if (trackCount <= 3) return "Stan";
  if (trackCount <= 6) return "Heavy rotation";
  return "Obsessed";
}

export function getFollowerCount(
  followers: number | undefined,
): string | undefined {
  if (followers === undefined) return undefined;
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(followers);
}

export function getArtistGenres(
  genres: string[] | undefined,
): string | undefined {
  if (!genres || genres.length === 0) return "-";
  return genres.join(", ");
}

export function getTrackDuration(
  durationMs: number | undefined,
): string | undefined {
  if (durationMs === undefined) return undefined;
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
