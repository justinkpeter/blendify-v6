import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import MetaPanel, { MetaRow } from "@/components/MetaPanel/MetaPanel";
import {
  getAlbumReleaseDate,
  getPopularityTier,
  getTrackDuration,
} from "@/components/MetaPanel/metaUtils";
import VisitSpotifyButton from "@/components/MetaPanel/VisitSpotifyButton";
import { CarouselTrackItem } from "@/components/ScrollCarousel/types";

export default function TracksMetaPanel({
  item,
  isPanelOpen,
  index,
}: {
  item?: CarouselTrackItem | null;
  isPanelOpen: boolean;
  index?: number;
}) {
  return (
    <>
      <MetaPanel isOpen={isPanelOpen}>
        <ul>
          <MetaRow>
            <AudioPlayer
              src={item?.track?.preview_url}
              name={item?.track?.name}
              id={item?.track?.id}
              isExplicit={item?.track?.explicit}
            />
          </MetaRow>
          <MetaRow label="Track Name" value={item?.track?.name} />
          <MetaRow
            label="Artist(s)"
            value={item?.track?.artists
              ?.map((artist) => artist.name)
              .join(", ")}
          />

          <MetaRow
            label="Popularity"
            value={getPopularityTier(item?.track?.popularity ?? 0)}
          />
          <MetaRow
            label="Duration"
            value={getTrackDuration(item?.track?.duration_ms)}
          />
          <MetaRow label="Album/EP" value={item?.track?.album?.name} />
          <MetaRow label="Top 10 Position" value={`${index ?? ""}`} />
          <MetaRow
            label="Released"
            value={getAlbumReleaseDate(item?.track?.album?.release_date)}
            hideBottomBorder
          />
        </ul>
        <VisitSpotifyButton url={item?.track?.external_urls?.spotify ?? ""} />
      </MetaPanel>
    </>
  );
}
