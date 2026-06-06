import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/router";

type AudioPlayerContextType = {
  currentTrackId: string | null;
  isPlaying: boolean;
  progress: number;
  playTrack: (trackId: string, src: string) => void;
  pause: () => void;
  handleScrub: (position: number) => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used within provider");
  return ctx;
};

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const router = useRouter();

  const startProgressTracking = useCallback(() => {
    const tick = () => {
      const audio = audioRef.current;
      if (audio && audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
      animationFrameRef.current = requestAnimationFrame(tick);
    };
    animationFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const playTrack = useCallback(
    (trackId: string, src: string = "") => {
      const audio = audioRef.current;
      if (!audio) return;

      if (trackId === currentTrackId && isPlaying) {
        audio.pause();
        setIsPlaying(false);
        stopProgressTracking();
        return;
      }

      if (audio.src !== src) {
        audio.src = src;
        setProgress(0);
      }

      audio
        .play()
        .then(() => {
          setCurrentTrackId(trackId);
          setIsPlaying(true);
          startProgressTracking();
        })
        .catch((err) => {
          console.error("Error playing audio:", err);
        });
    },
    [currentTrackId, isPlaying, startProgressTracking, stopProgressTracking],
  );

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
      stopProgressTracking();
    }
  }, [stopProgressTracking]);

  const handleScrub = useCallback((position: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = position * audio.duration;
    setProgress(position);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTrackId(null);
      setProgress(0);
      stopProgressTracking();
    };

    const handlePause = () => {
      if (!audio.ended) {
        setIsPlaying(false);
        stopProgressTracking();
      }
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
    };
  }, [stopProgressTracking]);

  useEffect(() => {
    const handleRouteChange = () => {
      pause();
      setCurrentTrackId(null);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, pause]);

  useEffect(() => {
    return () => stopProgressTracking();
  }, [stopProgressTracking]);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrackId,
        isPlaying,
        progress,
        playTrack,
        pause,
        handleScrub,
      }}
    >
      <audio ref={audioRef} preload="auto" />
      {children}
    </AudioPlayerContext.Provider>
  );
};
