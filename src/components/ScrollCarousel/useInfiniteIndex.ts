/**
 * Maps any unbounded integer to a valid array index.
 * Handles negative values correctly — JS % can return negative numbers.
 *
 * e.g. wrap(-1, 10) → 9
 *      wrap(11, 10) → 1
 */
export function wrap(index: number, length: number): number {
  return ((index % length) + length) % length;
}

/**
 * Converts a raw scroll offset (px) to the active virtual index.
 */
export function offsetToIndex(offset: number, itemHeight: number): number {
  return Math.round(offset / itemHeight);
}

/**
 * Converts a virtual index to its scroll offset (px).
 */
export function indexToOffset(index: number, itemHeight: number): number {
  return index * itemHeight;
}
