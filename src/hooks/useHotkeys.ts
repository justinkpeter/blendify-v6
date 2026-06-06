import { useEffect } from "react";

type HotkeyConfig = {
  key: string;
  handler: () => void;
  meta?: boolean;
  shift?: boolean;
  preventDefault?: boolean;
};

export default function useHotkeys(hotkeys: HotkeyConfig[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't fire when typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      for (const {
        key,
        handler,
        meta,
        shift,
        preventDefault = true,
      } of hotkeys) {
        const keyMatch = e.key.toLowerCase() === key.toLowerCase();
        const metaMatch = meta ? e.metaKey || e.ctrlKey : true;
        const shiftMatch = shift ? e.shiftKey : true;

        if (keyMatch && metaMatch && shiftMatch) {
          if (preventDefault) e.preventDefault();
          handler();
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hotkeys]);
}
