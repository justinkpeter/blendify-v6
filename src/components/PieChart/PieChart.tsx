import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PieChart.module.scss";

interface DataPoint {
  key: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: Record<string, number>;
  width?: number;
  height?: number;
  selectedIndex?: number | null;
}

export const colors = [
  "#ffb327",
  "#4ECDC4",
  "#45B7D1",
  "#FF6B6B",
  "#FFEEAD",
  "#D4A5A5",
];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 400,
  height = 400,
  selectedIndex = null,
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const center = { x: width / 2, y: height / 2 };
  const radius = Math.min(width, height) / 2.5;

  // Convert data to array and calculate total
  const dataArray: DataPoint[] = Object.entries(data)
    .slice(0, 6)
    .map(([key, value], index) => ({
      key,
      value,
      color: colors[index % colors.length],
    }));

  const total = dataArray.reduce((sum, { value }) => sum + value, 0);

  // Calculate pie slices
  let currentAngle = -90; // Start from top
  const slices = dataArray.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle: currentAngle,
    };
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const polarToCartesian = (angle: number) => {
    const angleInRadians = ((angle - 90) * Math.PI) / 180;
    return {
      x: center.x + radius * Math.cos(angleInRadians),
      y: center.y + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <div
      className={styles.pieChartContainer}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
    >
      <svg width={width} height={height}>
        <AnimatePresence>
          {slices.map((slice, index) => {
            const start = polarToCartesian(slice.startAngle);
            const end = polarToCartesian(slice.endAngle);
            const largeArcFlag =
              slice.endAngle - slice.startAngle <= 180 ? "0" : "1";

            const pathData = [
              `M ${center.x} ${center.y}`,
              `L ${start.x} ${start.y}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
              "Z",
            ].join(" ");

            return (
              <motion.path
                key={slice.key}
                d={pathData}
                fill={slice.color}
                initial={{ scale: 1, opacity: 0 }}
                animate={{
                  opacity:
                    hoveredSlice === index || selectedIndex === index ? 1 : 0.6,
                }}
                transition={{
                  duration: 0.15,
                }}
                onMouseEnter={() => setHoveredSlice(index)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={styles.slice}
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredSlice !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.2 }}
            className={styles.tooltip}
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y + 10,
            }}
          >
            <p className={styles.tooltipKey}>{slices[hoveredSlice].key}</p>
            <p className={styles.tooltipValue}>
              {slices[hoveredSlice].percentage.toFixed(1)}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
