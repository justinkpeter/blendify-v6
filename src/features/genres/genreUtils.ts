import { ArtistWithTopTrack } from "@/hooks/useTopArtists";

export type GenreItem = {
  genre: string;
  artists: ArtistWithTopTrack[];
  topTrack?: SpotifyApi.TrackObjectFull;
  image: string;
  era: string;
  frequency: number;
  frequencyLabel: string;
  sound: string;
};

function getEra(tracks: SpotifyApi.TrackObjectFull[]): string {
  if (tracks.length === 0) return "Now";
  const years = tracks
    .map((t) => new Date(t.album.release_date).getFullYear())
    .filter((y) => !isNaN(y));
  if (years.length === 0) return "Now";
  const avg = Math.round(years.reduce((a, b) => a + b, 0) / years.length);
  if (avg < 1980) return "Classic";
  if (avg < 1990) return "80s";
  if (avg < 2000) return "90s";
  if (avg < 2010) return "Early 2000s";
  if (avg < 2015) return "Late 2000s";
  if (avg < 2020) return "Early 2010s";
  if (avg < 2023) return "Early 2020s";
  return "Now";
}

function getSound(artists: ArtistWithTopTrack[]): string {
  if (artists.length === 0) return "—";
  const avg =
    artists.reduce((sum, a) => sum + (a.popularity ?? 0), 0) / artists.length;
  if (avg < 25) return "Underground";
  if (avg < 50) return "Cult";
  if (avg < 75) return "Mainstream";
  return "Iconic";
}

export function buildGenreItems(
  topArtists: ArtistWithTopTrack[],
  topTracks: SpotifyApi.TrackObjectFull[],
): GenreItem[] {
  if (!topArtists || !topTracks) return [];

  // Flatten and deduplicate genres
  const allGenres = Array.from(
    new Set(topArtists.flatMap((a) => a.genres ?? [])),
  );

  return allGenres
    .map((genre) => {
      const artists = topArtists.filter((a) => a.genres?.includes(genre));
      const artistIds = new Set(artists.map((a) => a.id));

      const genreTracks = topTracks.filter((t) =>
        t.artists.some((a) => artistIds.has(a.id)),
      );

      // Fall back to artist's topTrack if no genre track found
      const topTrack =
        genreTracks[0] ?? artists.find((a) => a.topTrack)?.topTrack;

      // Fall back to artist image if track has no album art
      const image =
        topTrack?.album.images[0]?.url ?? artists[0]?.images?.[0]?.url ?? "";

      const frequency = genreTracks.length;
      const frequencyLabel =
        frequency === 0
          ? "Artist-specific genre"
          : frequency === 1
            ? "1 of your top tracks"
            : `${frequency} of your top tracks`;

      return {
        genre,
        artists,
        topTrack,
        image,
        era: getEra(genreTracks),
        frequency,
        frequencyLabel,
        sound: getSound(artists),
      };
    })
    .filter((g) => g.artists.length > 0 && g.topTrack && g.image)
    .sort((a, b) => b.frequency - a.frequency);
}
