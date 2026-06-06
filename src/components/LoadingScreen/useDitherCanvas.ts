import { useCallback, useEffect, useRef } from "react";
import { Phase } from "./useLoadingSequence";

// Progress threshold at which dithering reaches full intensity (0–1)
const DITHER_FULLY_MAXED_AT = 0.82;
const DITHER_CANVAS_RESOLUTION = 400;

// Bayer 8×8 ordered dither matrix — values 0–63
// Higher values = later to threshold = darker dots appear last
const BAYER_8X8_MATRIX = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
] as const;

function computeDitherStrengthFromProgress(progress: number): number {
  const normalized = Math.min(progress / 100, 1);
  return normalized <= DITHER_FULLY_MAXED_AT
    ? normalized / DITHER_FULLY_MAXED_AT
    : 1;
}

export function useDitherCanvas(
  imageSrc: string,
  progress: number,
  phase: Phase,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);
  const pendingFrameRef = useRef<number | null>(null);

  const applyBayerDitherToCanvas = useCallback(
    (image: HTMLImageElement, ditherStrength: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw the clean source image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      if (ditherStrength <= 0) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data; // flat RGBA array

      for (let row = 0; row < canvas.height; row++) {
        for (let col = 0; col < canvas.width; col++) {
          const pixelIndex = (row * canvas.width + col) * 4;

          // Cache originals before any mutation
          const originalRed = pixels[pixelIndex];
          const originalGreen = pixels[pixelIndex + 1];
          const originalBlue = pixels[pixelIndex + 2];

          // Perceived luminance (ITU-R BT.601)
          const luminance =
            0.299 * originalRed + 0.587 * originalGreen + 0.114 * originalBlue;

          // Bayer threshold maps matrix value (0–63) to bias around 128
          const bayerBias = (BAYER_8X8_MATRIX[row % 8][col % 8] / 63) * 255;
          const ditherThreshold = (bayerBias - 128) * ditherStrength + 128;

          // Hard black or white based on whether luminance clears the threshold
          const binaryValue = luminance > ditherThreshold ? 255 : 0;

          // Blend original color toward binary dither based on strength
          pixels[pixelIndex] =
            originalRed * (1 - ditherStrength) + binaryValue * ditherStrength;
          pixels[pixelIndex + 1] =
            originalGreen * (1 - ditherStrength) + binaryValue * ditherStrength;
          pixels[pixelIndex + 2] =
            originalBlue * (1 - ditherStrength) + binaryValue * ditherStrength;
          // Alpha (pixelIndex + 3) intentionally untouched
        }
      }

      ctx.putImageData(imageData, 0, 0);
    },
    [], // refs are stable — no reactive deps
  );

  // Load image once per src, draw clean at strength 0
  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      loadedImageRef.current = image;
      const canvas = canvasRef.current;
      if (!canvas) return;
      // Clamp canvas to max resolution — dramatically reduces pixel loop iterations
      // CSS width: 100% handles the visual upscale with no quality loss for dithering
      const scale = Math.min(
        DITHER_CANVAS_RESOLUTION / image.naturalWidth,
        DITHER_CANVAS_RESOLUTION / image.naturalHeight,
        1, // never upscale beyond natural size
      );
      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale);

      applyBayerDitherToCanvas(image, 0);
    };

    image.onerror = () => {
      console.error(`[useDitherCanvas] Failed to load image: ${imageSrc}`);
    };

    image.src = imageSrc;
  }, [imageSrc, applyBayerDitherToCanvas]);

  // Redraw each time progress advances, only during the loading phase
  useEffect(() => {
    const image = loadedImageRef.current;
    if (!image || phase !== Phase.Loading) return;

    const ditherStrength = computeDitherStrengthFromProgress(progress);

    if (pendingFrameRef.current !== null) {
      cancelAnimationFrame(pendingFrameRef.current);
    }

    pendingFrameRef.current = requestAnimationFrame(() => {
      applyBayerDitherToCanvas(image, ditherStrength);
      pendingFrameRef.current = null;
    });

    return () => {
      if (pendingFrameRef.current !== null) {
        cancelAnimationFrame(pendingFrameRef.current);
        pendingFrameRef.current = null;
      }
    };
  }, [progress, phase, applyBayerDitherToCanvas]);

  return { canvasRef };
}
