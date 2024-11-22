import Insights from "@/lib/insights";
import { SparklesIcon } from "@heroicons/react/24/solid";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import InsightCard from "../InsightCard/InsightCard";
import styles from "./SelectedTrack.module.scss";
import React from "react";

export default function TrackOverview({
  track,
}: {
  track: SpotifyApi.TrackObjectFull;
}) {
  return (
    <div className={styles.overview}>
      <div className={styles.overview__preview}>
        <img
          src={track.album.images[0].url}
          alt="Album cover"
          draggable={false}
        />
        <div>
          <a href={track.uri}>
            <img src="/img/spotify-icon-white.png" alt="Spotify logo" />
          </a>
          <AudioPlayer src={track.preview_url} />
        </div>
      </div>
      <div className={styles.overview__info}>
        <h1>{track.name}</h1>
        <ArtistsList artists={track.artists} />
        <div className={styles.overview__insights}>
          <InsightCard
            icon={Insights.getPopularityIcon(track.popularity)}
            title="Popularity"
            value={Insights.getSongPopularity(track.popularity)}
          />
          <InsightCard
            icon={<SparklesIcon />}
            title="Release Date"
            value={Insights.getReleaseDate(track.album.release_date)}
          />
        </div>
      </div>
    </div>
  );
}

export function ArtistsList({
  artists,
}: {
  artists: SpotifyApi.ArtistObjectSimplified[];
}) {
  return (
    <div className={styles.artists}>
      {artists.map((artist, index) => (
        <React.Fragment key={artist.id}>
          <a href={artist.uri}>{artist.name}</a>
          {index < artists.length - 1 && ", "}
        </React.Fragment>
      ))}
    </div>
  );
}
