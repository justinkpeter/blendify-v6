import { useState, useRef, useEffect } from "react";

/**
 * Custom hook for managing audio playback with global control.
 * Ensures only one track plays at a time by using a CustomEvent.
 */
export default function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      // Dispatch a global event to pause all other audio players
      const event = new CustomEvent("pause-all-audio", {
        detail: audioRef.current,
      });
      window.dispatchEvent(event);

      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    setIsPlaying(!isPlaying);
  };

  const handleScrub = (position: number) => {
    if (!audioRef.current || !audioRef.current.duration) return;

    audioRef.current.currentTime = position * audioRef.current.duration;
    setProgress(position);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let animationFrameId: number;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
      animationFrameId = requestAnimationFrame(updateProgress);
    };

    const handleEnded = () => {
      setProgress(0);
      setIsPlaying(false);
    };

    const handleGlobalPause = (e: Event) => {
      const target = (e as CustomEvent).detail as HTMLAudioElement;
      if (audio !== target) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(updateProgress);
    }

    audio.addEventListener("ended", handleEnded);
    window.addEventListener("pause-all-audio", handleGlobalPause);

    return () => {
      cancelAnimationFrame(animationFrameId);
      audio.removeEventListener("ended", handleEnded);
      window.removeEventListener("pause-all-audio", handleGlobalPause);
    };
  }, [isPlaying]);

  return {
    audioRef,
    isPlaying,
    togglePlay,
    progress,
    handleScrub,
  };
}
