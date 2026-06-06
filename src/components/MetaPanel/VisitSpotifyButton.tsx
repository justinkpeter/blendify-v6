import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./VisitSpotifyButton.module.scss";
export default function VisitSpotifyButton({ url }: { url: string }) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.spotifyButton}
      title={"View on Spotify"}
    >
      View on Spotify <ArrowUpRight size={16} />
    </Link>
  );
}
