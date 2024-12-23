import React from "react";
import styles from "./Filters.module.scss";

const filterOptions = [
  { label: "recent", value: "short_term" },
  { label: "six months", value: "medium_term" },
  { label: "year", value: "long_term" },
] as const;

export type FilterValue = (typeof filterOptions)[number]["value"];

interface FiltersProps {
  activeFilter: FilterValue;
  setActiveFilter: (filter: FilterValue) => void;
}

export default function Filters({
  activeFilter,
  setActiveFilter,
}: FiltersProps) {
  return (
    <div className={styles.filters}>
      {filterOptions.map((option) => (
        <button
          key={option.value}
          className={`${styles.filterButton} ${
            option.value === activeFilter ? styles.active : ""
          }`}
          onClick={() => setActiveFilter(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
