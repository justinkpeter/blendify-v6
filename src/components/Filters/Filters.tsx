import React from "react";
import { useTracksContext } from "@/context/TracksContext";
import styles from "./Filters.module.scss";

const filterOptions = [
  { label: "recent", value: "short_term" },
  { label: "six months", value: "medium_term" },
  { label: "year", value: "long_term" },
] as const;

export type FilterOption = (typeof filterOptions)[number];

export default function Filters() {
  const { activeFilter, setActiveFilter } = useTracksContext();

  return (
    <div className={styles.filters}>
      {filterOptions.map((option) => (
        <button
          key={option.value}
          className={`${styles.filterButton} ${
            option.value === activeFilter.value ? styles.active : ""
          }`}
          onClick={() => setActiveFilter(option)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
