import React from "react";
import styles from "./SelectedTrackDetails.module.scss";
import { ArtistsList } from "./TrackOverview";

export default function TrackMeta({
  album,
  artists,
}: {
  album: SpotifyApi.AlbumObjectSimplified;
  artists: SpotifyApi.ArtistObjectSimplified[];
}) {
  return (
    <div className={styles.trackMeta}>
      <MetaItem
        label="Release Date"
        value={new Date(album.release_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      />
      <MetaItem label="Album" value={album.name} />
      <MetaItem label="Artists" value={<ArtistsList artists={artists} />} />
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.metaItem}>
      <div className={styles.metaItem__label}>{label}</div>
      <div className={styles.metaItem__value}>{value}</div>
    </div>
  );
}
