import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./Recommendations.module.scss";

export default function Recommendations({
  recommendations,
  selectedIndex,
  onSelect,
}: {
  recommendations: { id: string; name: string; albumArt: string }[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}) {
  return (
    <div className={styles.recs}>
      {recommendations.map((rec, i) => (
        <motion.div
          key={rec.id}
          className={`${styles.rec} ${
            selectedIndex === i ? styles.selected : ""
          }`}
          onClick={() => onSelect(i)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <Image
            src={rec.albumArt}
            alt={rec.name}
            draggable={false}
            width={80}
            height={80}
            title={rec.name}
          />
        </motion.div>
      ))}
    </div>
  );
}
