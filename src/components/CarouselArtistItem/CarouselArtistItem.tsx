import { motion } from "framer-motion";
import styles from "./CarouselArtistItem.module.scss";

export default function CarouselArtistItem({
  index,
  handleArtistSelection,
  hoveredIndex,
  setHoveredIndex,
  artist,
}: {
  index: number;
  handleArtistSelection: (artist: SpotifyApi.ArtistObjectFull) => void;
  hoveredIndex: number;
  setHoveredIndex: (index: number) => void;
  artist: SpotifyApi.ArtistObjectFull;
}) {
  return (
    <div
      className={`${styles.carouselArtistItem} ${
        hoveredIndex === index ? styles.hoveredItem : ""
      }`}
    >
      <motion.img
        src={artist.images[0].url}
        alt={artist.name}
        width={300}
        height={300}
        layoutId={`artist-image-${artist.id}`}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseDown={(e) => {
          const startX = e.clientX;
          const startY = e.clientY;

          const handleMouseDown = (upEvent: MouseEvent) => {
            const dx = Math.abs(upEvent.clientX - startX);
            const dy = Math.abs(upEvent.clientY - startY);
            if (dx < 5 && dy < 5) handleArtistSelection(artist);
            window.removeEventListener("mouseup", handleMouseDown);
          };

          window.addEventListener("mouseup", handleMouseDown);
        }}
        draggable={false}
      />
    </div>
  );
}
