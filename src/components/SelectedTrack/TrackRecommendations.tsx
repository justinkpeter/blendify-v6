import AudioPlayer from "../AudioPlayer/AudioPlayer";
import Image from "next/image";
import { ArtistsList } from "./TrackOverview";
import { useRecommendations } from "@/hooks/useRecommendations";
import styles from "./SelectedTrack.module.scss";

export default function TrackRecommendations({
  seed,
}: {
  seed: SpotifyApi.TrackObjectFull["id"];
}) {
  const { recommendations, loading } = useRecommendations(seed);

  if (loading) {
    return "Loading...";
  }

  return (
    <div className={styles.recommendations}>
      <h3>More tracks you might like</h3>
      <div className={styles.recommendations__list}>
        {recommendations ? (
          <>
            {recommendations.map((track) => (
              <div key={track.id} className={styles.recommendations__item}>
                <Image
                  src={track.album.images[0].url}
                  alt="Album cover"
                  width={80}
                  height={80}
                />
                <div>
                  <div className={styles.recommendations__item_name}>
                    <div>{track.name}</div>
                    <ArtistsList artists={track.artists} />
                  </div>
                  <div className={styles.recommendations__item_preview}>
                    <a href={track.uri}>
                      <Image
                        src="/img/spotify-icon-white.png"
                        width={16}
                        height={16}
                        alt={"spotify-link"}
                      />
                    </a>
                    <AudioPlayer src={track.preview_url} />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>Loading...</>
        )}
      </div>
    </div>
  );
}
