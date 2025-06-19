import Image from "next/image";
import Link from "next/link";
import styles from "./TrackDetails.module.scss";

interface TrackDetailsProps {
  artistMetadata: SpotifyApi.ArtistObjectFull[] | null;
  releaseDate: string;
  genreList: string[];
}

export default function TrackDetails({
  artistMetadata,
  releaseDate,
  genreList,
}: TrackDetailsProps) {
  return (
    <div className={styles.trackDetails}>
      <div className={styles.trackDetails__section}>
        <h3>Artists</h3>
        <div className={styles.trackDetails__list}>
          {artistMetadata?.map((artist) => (
            <Link
              key={artist.id}
              className={styles.trackDetails__item}
              href={artist.external_urls.spotify}
              title={artist.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={artist.images?.[0]?.url || "/img/artist-placeholder.png"}
                alt={artist.name}
                title={artist.name}
                width={32}
                height={32}
                className={styles.trackDetails__image}
              />
              <span>{artist.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.trackDetails__section}>
        <h3>Release Date</h3>
        <span>
          {new Date(releaseDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      <div className={styles.trackDetails__section}>
        <h3>Genres</h3>
        <div className={styles.trackDetails__list}>
          {genreList.length > 0 ? (
            genreList.map((genre, index) => (
              <span key={index} className={styles.trackDetails__pill}>
                {genre}
              </span>
            ))
          ) : (
            <span className={styles.trackDetails__pill}>
              No genres available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
