import React from "react";
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
      <div className={styles.trackItem__name}>
        <a href={trackUri} title={name} target={"_blank"} rel={"noreferrer"}>
          {name}
        </a>
      </div>
      <div className={styles.trackItem__album}>
        /
        <a
          href={album.uri}
          title={album.name}
          target={"_blank"}
          rel={"noreferrer"}
        >
          {album.name}
        </a>
      </div>
      <div className={styles.trackItem__image}>
        <Image
          src={album.images[0].url}
          alt={album.name}
          width={250}
          height={250}
          draggable={false}
        />
      </div>
      <div className={styles.trackItem__audioPlayer}>
        <AudioPlayer src={preview} />
      </div>
    </div>
  );
}
