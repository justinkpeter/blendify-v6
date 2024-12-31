import React from "react";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import Image from "next/image";
import styles from "./SelectedRecommendation.module.scss";

interface Recommendation {
  id: string;
  name: string;
  artists: {
    name: string;
    uri: string;
  }[];
  album: string;
  albumArt: string;
  preview: string | null;
  uri: string;
}

export default function SelectedRecommendation({
  recommendation,
}: {
  recommendation: Recommendation | null;
}) {
  if (!recommendation) return null;

  return (
    <div className={styles.selectedRec}>
      <a href={recommendation.uri} title={recommendation.name}>
        <h4>{recommendation.name}</h4>
      </a>
      <p>
        {recommendation.artists.map((artist, i) => (
          <span key={i}>
            <a href={artist.uri} title={artist.name}>
              {artist.name}
            </a>
            {i < recommendation.artists.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
      <br />
      <div>
        <AudioPlayer src={recommendation.preview} />
        <a title="Open Spotify" href={recommendation.uri}>
          <Image
            src={"/img/spotify-icon-white.png"}
            alt={recommendation.name}
            draggable={false}
            width={16}
            height={16}
          />
        </a>
      </div>
    </div>
  );
}
