import React from "react";
import styles from "./Filters.module.scss";

interface FilterOption {
  label: string;
  value: "short_term" | "medium_term" | "long_term";
}

interface FilterProps {
  options: FilterOption[];
  activeOption: FilterOption;
  onSelect: (option: FilterOption) => void;
}

export default function Filters({
  options,
  activeOption,
  onSelect,
}: FilterProps) {
  return (
    <div className={styles.filters}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`${styles.filters__option} ${
            option.value === activeOption.value ? styles.active : ""
          }`}
          onClick={() => onSelect(option)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
