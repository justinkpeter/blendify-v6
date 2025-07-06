import { motion } from "framer-motion";
import styles from "./SelectedArtist.module.scss";

type Props = {
  albumCount?: number;
  singleCount?: number;
};

export default function Discography({
  albumCount = 0,
  singleCount = 0,
}: Props) {
  if (!albumCount && !singleCount) return null;

  return (
    <motion.div className={styles.selectedArtist__pill}>
      <div>Discography</div>
      <div>
        {albumCount?.toLocaleString()} albums, {singleCount?.toLocaleString()}{" "}
        singles
      </div>
    </motion.div>
  );
}
