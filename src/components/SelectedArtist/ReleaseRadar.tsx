import Image from "next/image";
import styles from "./SelectedArtist.module.scss";
import Link from "next/link";
import Badge from "../Badge/Badge";

type Props = {
  latestRelease?: SpotifyApi.AlbumObjectSimplified | null;
};

export default function ReleaseRadar({ latestRelease }: Props) {
  if (!latestRelease) return null;

  return (
    <div className={styles.selectedArtist__latestRelease}>
      <div>Release Radar</div>
      <Link href={latestRelease.href}>
        <Image
          src={latestRelease.images[0]?.url || "/img/placeholder-album.png"}
          alt="Latest Release"
          className={styles.selectedArtist__latestReleaseImage}
          width={48}
          height={48}
        />
        <div className={styles.selectedArtist__latestReleaseName}>
          <div>{latestRelease.name}</div>
          <div>
            {new Date(latestRelease.release_date)
              .toLocaleDateString()
              .replaceAll("/", ".")}

            <Badge>{latestRelease.album_type}</Badge>
          </div>
        </div>
      </Link>
    </div>
  );
}
