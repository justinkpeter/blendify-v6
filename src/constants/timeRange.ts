export enum TimeRange {
  Short = "short_term",
  Medium = "medium_term",
  Long = "long_term",
}

export const TimeRangeLabels: Record<TimeRange, string> = {
  [TimeRange.Short]: "4 weeks",
  [TimeRange.Medium]: "6 months",
  [TimeRange.Long]: "1 year",
};

export const TimeRangeOptions = Object.values(TimeRange).map((value) => ({
  label: TimeRangeLabels[value],
  value,
}));
