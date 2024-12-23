import AudioPlayer from "../AudioPlayer/AudioPlayer";
import styles from "./ArtistItem.module.scss";
import Image from "next/image";

export default function ArtistItem({
  image,
  name,
  preview,
  artistUri,
  genres,
  monthlyListeners,
}: {
  image: string;
  name: string;
  preview: string | null;
  artistUri: string;
  monthlyListeners: number;
  genres: string[];
}) {
  return (
    <div className={styles.artistItem}>
      <Image
        alt={name}
        className={styles.artistItem__image}
        draggable={false}
        src={image}
        width={350}
        height={350}
        title={name}
      />
      <div className={styles.artistItem__info}>
        <a href={artistUri} title={name}>
          <span>{name}</span>
        </a>
        <br />
        <div>
          <span>monthly listeners: </span>
          {monthlyListeners.toLocaleString()}
          <br />
          <span className={styles.lightText}>Genres</span>/{" "}
          {genres.map((genre, index) => (
            <span key={index}>
              {" "}
              {genre}
              {index < genre.length - 1 && ", "}
            </span>
          ))}
        </div>
      </div>
      {preview && (
        <div className={styles.artistPreview}>
          <AudioPlayer src={preview} />
          <a href={artistUri} title={name}>
            <Image
              src={"/img/spotify-icon-white.png"}
              alt={name}
              draggable={false}
              title={`click to listen on Spotify`}
              width={350}
              height={350}
            />
          </a>
        </div>
      )}
    </div>
  );
}
