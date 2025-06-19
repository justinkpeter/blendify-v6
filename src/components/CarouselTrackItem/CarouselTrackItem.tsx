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
        width={350}
        height={350}
        layoutId={`track-image-${track.id}`}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseDown={(e) => {
          const startX = e.clientX;
          const startY = e.clientY;

          const handleMouseUp = (upEvent: MouseEvent) => {
            const dx = Math.abs(upEvent.clientX - startX);
            const dy = Math.abs(upEvent.clientY - startY);
            if (dx < 5 && dy < 5) handleTrackSelection(track);
            window.removeEventListener("mouseup", handleMouseUp);
          };

          window.addEventListener("mouseup", handleMouseUp);
        }}
        draggable={false}
      />
    </div>
  );
}
