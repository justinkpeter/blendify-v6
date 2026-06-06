import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import MetaPanel, { MetaRow } from "@/components/MetaPanel/MetaPanel";
import {
  getArtistGenres,
  getFollowerCount,
  getListeningStyle,
  getPopularityTier,
} from "@/components/MetaPanel/metaUtils";
import { CarouselArtistItem } from "@/components/ScrollCarousel/types";
import TrackThumbnail from "./TrackThumbnail";
import { getArtistTopTrack } from "@/components/ScrollCarousel/carouselUtils";
import VisitSpotifyButton from "@/components/MetaPanel/VisitSpotifyButton";

export default function ArtistsMetaPanel({
  item,
  isPanelOpen,
  topTracks,
}: {
  item?: CarouselArtistItem | null;
  isPanelOpen: boolean;
  topTracks: SpotifyApi.TrackObjectFull[];
}) {
  const trackCount = item
    ? topTracks?.filter((track) =>
        track.artists.some((artist) => artist.id === item.artist.id),
      ).length
    : undefined;

  return (
    <MetaPanel isOpen={isPanelOpen}>
      <ul>
        <MetaRow
          label={`Most popular track by ${item?.artist?.name}`}
          hideBottomBorder
        />
        <MetaRow padding={4} height={60} hideBottomBorder>
          <TrackThumbnail track={item?.artist?.topTrack} />
        </MetaRow>
        <MetaRow>
          <AudioPlayer
            src={item && getArtistTopTrack(item)?.track?.preview_url}
            name={item && getArtistTopTrack(item)?.track?.name}
            id={item && getArtistTopTrack(item)?.track?.id}
            isExplicit={
              item ? getArtistTopTrack(item)?.track?.explicit : undefined
            }
            hideLabel
          />
        </MetaRow>
        <MetaRow
          label="Popularity"
          value={getPopularityTier(item?.artist?.popularity ?? 0)}
        />
        <MetaRow
          label="Spotify Followers"
          value={getFollowerCount(item?.artist?.followers?.total)}
        />
        <MetaRow label="Genres" value={getArtistGenres(item?.artist?.genres)} />
        <MetaRow
          label="Listening style"
          value={getListeningStyle(trackCount ?? 0)}
          hideBottomBorder
        />
      </ul>
      <VisitSpotifyButton url={item?.artist?.external_urls?.spotify ?? ""} />
    </MetaPanel>
  );
}
