import { useState, useRef, useEffect } from "react";

export default function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
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

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(updateProgress);
    }

    const handleEnded = () => {
      setProgress(0);
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      cancelAnimationFrame(animationFrameId);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isPlaying]);

  const handleScrub = (position: number) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = position * audioRef.current.duration;
    setProgress(position);
  };

  return { audioRef, isPlaying, togglePlay, progress, handleScrub };
}
