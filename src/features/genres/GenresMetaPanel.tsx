import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import MetaPanel, { MetaRow } from "@/components/MetaPanel/MetaPanel";
import { CarouselGenreItem } from "@/components/ScrollCarousel/types";
import VisitSpotifyButton from "@/components/MetaPanel/VisitSpotifyButton";
import TrackThumbnail from "../artists/TrackThumbnail";

export default function GenresMetaPanel({
  item,
  isPanelOpen,
}: {
  item?: CarouselGenreItem | null;
  isPanelOpen: boolean;
}) {
  const genre = item?.genre;
  const topTrack = genre?.topTrack;
  const favoriteArtists = genre?.artists
    .slice(0, 3)
    .map((a) => a.name)
    .join(", ");

  return (
    <MetaPanel isOpen={isPanelOpen}>
      <ul>
        <MetaRow
          label={`Your most listened track for ${genre?.genre ? genre.genre.charAt(0).toUpperCase() + genre.genre.slice(1) : ""}`}
          hideBottomBorder
        />
        <MetaRow padding={4} height={60} hideBottomBorder>
          <TrackThumbnail track={topTrack} />
        </MetaRow>
        <MetaRow>
          <AudioPlayer
            src={topTrack?.preview_url}
            name={topTrack?.name}
            id={topTrack?.id}
            isExplicit={topTrack?.explicit}
            hideLabel
          />
        </MetaRow>
        <MetaRow label="Genre" value={genre?.genre} />
        <MetaRow label="Favorite Artists" value={favoriteArtists} />
        <MetaRow label="Listening Era" value={genre?.era} />
        <MetaRow label="Sound" value={genre?.sound} />
        <MetaRow
          label="Frequency"
          value={genre?.frequencyLabel}
          hideBottomBorder
        />
      </ul>
      {topTrack && (
        <VisitSpotifyButton url={topTrack.external_urls?.spotify ?? ""} />
      )}
    </MetaPanel>
  );
}
