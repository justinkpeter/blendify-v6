import { useState, useCallback } from "react";

export type ToastItem = {
  id: number;
  message: string;
  exiting: boolean;
};

let nextId = 0;

export function useToast(duration = 2000) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback(
    (message: string, image?: string) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, image, exiting: false }]);

      // Start exit animation
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
        );
      }, duration);

      // Remove after animation completes
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration + 300);
    },
    [duration],
  );

  return { toasts, show };
}
