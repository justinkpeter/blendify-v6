import Image from "next/image";
import styles from "./TrackThumbnail.module.scss";
import { ExplicitBadge } from "@/components/MetaPanel/MetaPanel";
import Marquee from "@/components/Marquee/Marquee";

export default function TrackThumbnail({
  track,
}: {
  track?: SpotifyApi.TrackObjectFull | null;
}) {
  return (
    <div className={styles.topTrack}>
      {track?.album.images[0]?.url && (
        <Image
          src={track.album.images[0].url}
          alt={track.album.name || ""}
          height={40}
          width={40}
          objectFit="cover"
        />
      )}
      <div className={styles.topTrackInfo}>
        <Marquee className={styles.topTrackInfo__name} key={track?.id}>
          {track?.name ?? ""}
        </Marquee>
        <div className={styles.topTrackInfo__album}>
          {track?.explicit && <ExplicitBadge isExplicit={track.explicit} />}
          <Marquee className={styles.topTrackInfo__album} key={track?.id}>
            {track?.album?.name}
          </Marquee>
        </div>
      </div>
    </div>
  );
}
