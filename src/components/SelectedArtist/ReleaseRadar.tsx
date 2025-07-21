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
    <Link
      className={styles.selectedArtist__latestRelease}
      href={latestRelease.href}
    >
      <div>Latest Release</div>
      <div>
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
      </div>
    </Link>
  );
}
