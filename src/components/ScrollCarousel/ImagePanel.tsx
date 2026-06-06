import Image from "next/image";
import { AnyCarouselItem } from "./types";
import {
  getCarouselItemId,
  getCarouselItemImageSrc,
  getCarouselItemName,
} from "./carouselUtils";
import styles from "./ScrollCarousel.module.scss";

type ImagePanelProps = {
  items: AnyCarouselItem[];
  activeIndex: number;
};

export default function ImagePanel({ items, activeIndex }: ImagePanelProps) {
  return (
    <div className={styles.panel}>
      {items?.map((item, index) => (
        <div
          key={getCarouselItemId(item)}
          className={`${styles.panel__image} ${index === activeIndex ? styles["panel__image--visible"] : ""}`}
        >
          <Image
            src={getCarouselItemImageSrc(item)}
            alt={getCarouselItemName(item)}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            style={{ objectFit: "cover" }}
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
