import AudioPlayer from "../AudioPlayer/AudioPlayer";
import styles from "./TrackItem.module.scss";
import Image from "next/image";

export default function TrackItem({
  album,
  name,
  preview,
  trackUri,
}: {
  album: SpotifyApi.TrackObjectFull["album"];
  name: string;
  preview: string | null;
  trackUri: string;
}) {
  return (
    <div className={styles.trackItem}>
      <Image
        alt={name}
        className={styles.trackItem__image}
        draggable={false}
        src={album.images[0].url}
        width={350}
        height={350}
        title={name}
      />
      <div className={styles.trackItem__info}>
        <a href={trackUri} title={name}>
          <span title={name}>{name}</span>
        </a>
        <br />
        <div>
          <a href={album.uri} title={`Album: ${album.name}`}>
            <span className={styles.lightText}>{album.name}</span>
          </a>{" "}
          /{" "}
          {album.artists.map((artist, index) => (
            <span key={artist.id}>
              {" "}
              <a href={artist.uri} title={artist.name}>
                {artist.name}
              </a>
              {index < album.artists.length - 1 && ", "}
            </span>
          ))}
        </div>
      </div>
      {preview && (
        <div className={styles.trackPreview}>
          <AudioPlayer src={preview} />
          <a href={trackUri} title={name}>
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
