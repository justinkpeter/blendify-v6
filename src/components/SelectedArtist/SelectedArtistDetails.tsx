import { ArtistProfile } from "./useArtistDetails";
import styles from "./SelectedArtistDetails.module.scss";
import Vinyl from "../Vinyl/Vinyl";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Carousel from "../Carousel/Carousel";

export default function SelectedArtistDetails({
  data,
  followers,
}: {
  data: ArtistProfile;
  followers: SpotifyApi.FollowersObject;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={styles.artistDetails}
        initial={{ filter: "blur(8px)", opacity: 0 }}
        animate={{ filter: "blur(0px)", opacity: 1 }}
        exit={{ filter: "blur(8px)", opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Discography</div>
          <div className={styles.countList}>
            {data.epCount > 0 && <div>{data.epCount} EPs</div>}
            {data.albumCount > 0 && <div>{data.albumCount} Albums</div>}
            {data.singleCount > 0 && <div>{data.singleCount} Singles</div>}
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Latest Release</div>
          {data.latestRelease ? (
            <div className={styles.countList}>
              <Link
                href={data.latestRelease.external_urls.spotify}
                rel="noopener noreferrer"
                title={data.latestRelease.name}
              >
                {data.latestRelease.name} ({data.latestRelease.type})
              </Link>
              {new Date(data.latestRelease.release_date).toLocaleDateString()}
            </div>
          ) : (
            <div className={styles.fallback}>N/A</div>
          )}
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Monthly Listeners</div>
          <div>{followers.total.toLocaleString()}</div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Top Tracks</div>
          <div className={styles.topTracks}>
            <Carousel
              items={data.topTracks.slice(0, 5)}
              renderItem={(track, index) => (
                <div key={track.name} className={styles.trackItem}>
                  <Vinyl
                    track={track}
                    isVisible={true}
                    onClose={() => {}}
                    onSelectTrack={() => {}}
                    key={index}
                  />
                  <Link
                    href={track.external_urls.spotify}
                    className={styles.truncated}
                    title={track.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {track.name}
                  </Link>
                </div>
              )}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
