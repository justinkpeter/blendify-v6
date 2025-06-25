import { motion } from "framer-motion";
import styles from "./CarouselTrackItem.module.scss";

export default function CarouselTrackItem({
  index,
  handleTrackSelection,
  hoveredIndex,
  setHoveredIndex,
  track,
}: {
  index: number;
  handleTrackSelection: (track: SpotifyApi.TrackObjectFull) => void;
  hoveredIndex: number;
  setHoveredIndex: (index: number) => void;
  track: SpotifyApi.TrackObjectFull;
}) {
  return (
    <div
      className={`${styles.carouselTrackItem} ${
        hoveredIndex === index ? styles.hoveredItem : ""
      }`}
    >
      <motion.img
        src={track.album.images[0].url}
        alt={track.name}
        width={300}
        height={300}
        layoutId={`track-image-${track.id}`}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseDown={(e) => {
          const startX = e.clientX;
          const startY = e.clientY;

          const handleMouseDown = (upEvent: MouseEvent) => {
            const dx = Math.abs(upEvent.clientX - startX);
            const dy = Math.abs(upEvent.clientY - startY);
            if (dx < 5 && dy < 5) handleTrackSelection(track);
            window.removeEventListener("mouseup", handleMouseDown);
          };

          window.addEventListener("mouseup", handleMouseDown);
        }}
        draggable={false}
      />
    </div>
  );
}
