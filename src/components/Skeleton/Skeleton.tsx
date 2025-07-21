import styles from "./Skeleton.module.scss";
import clsx from "clsx";

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
};

export default function Skeleton({
  width = "100%",
  height = "1rem",
  borderRadius = "4px",
  className,
}: SkeletonProps) {
  return (
    <div
      className={clsx(styles.skeleton, className)}
      style={{ width, height, borderRadius }}
    />
  );
}
