import React from "react";
import styles from "./GenreList.module.scss";
import { colors } from "@/components/PieChart/PieChart";
import { filterOptions } from "../Filters/Filters";

interface GenreListProps {
  topGenres: { genre: string; percentage: number }[];
  activeFilter: string;
  onHover: (index: number | null) => void;
}

export default function GenreList({
  topGenres,
  activeFilter,
  onHover,
}: GenreListProps) {
  const activeFilterLabel = filterOptions.find(
    (option) => option.value === activeFilter
  )?.label;

  return (
    <div className={styles.genreList}>
      <h4>{topGenres[0].genre} goes hard</h4>
      <br />
      <p>
        This genre appears in{" "}
        <span className={styles.selectedGenre}>
          {topGenres[0].percentage.toFixed(0)}%
        </span>{" "}
        of your top 50 songs in the last
        {activeFilter === "short_term" ? "4 weeks" : activeFilterLabel}.
      </p>
      <ol>
        {topGenres.map((genre, i) => (
          <li
            key={genre.genre}
            style={{ color: colors[i] }}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
          >
            <div>
              <span>{genre.genre}</span>
              <span>{genre.percentage.toFixed(1)}%</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
