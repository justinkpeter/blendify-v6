import { useState } from "react";

export default function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return { isFullscreen, toggleFullscreen };
}
