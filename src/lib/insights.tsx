import {
  ArrowTrendingUpIcon,
  BeakerIcon,
  FireIcon,
  MoonIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import spotifyApi from "./spotify";

export default class Insights {
  static getSongPopularity(pi: number): string {
    if (pi >= 90) return "Hot";
    if (pi >= 70) return "Trending";
    if (pi >= 50) return "Well Known";
    if (pi >= 30) return "Lowkey";
    return "Underground";
  }

  static getPopularityIcon(pi: number): React.ReactNode {
    if (pi >= 90) return <FireIcon />;
    if (pi >= 70) return <ArrowTrendingUpIcon />;
    if (pi >= 50) return <StarIcon />;
    if (pi >= 30) return <MoonIcon />;
    return <BeakerIcon />;
  }

  static getReleaseDate(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  static async getArtistImage(
    artist: SpotifyApi.ArtistObjectFull
  ): Promise<string> {
    const response = await spotifyApi.getArtist(artist.id);
    return response.body.images[0].url;
  }
}
