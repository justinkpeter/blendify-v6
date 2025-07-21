import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/router"; // <-- 👈 Import useRouter

type AudioPlayerContextType = {
  currentTrackId: string | null;
  isPlaying: boolean;
  playTrack: (trackId: string, src: string) => void;
  pause: () => void;
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const playTrack = useCallback(
    (trackId: string, src: string = "") => {
      const audio = audioRef.current;
      if (!audio) return;

      if (trackId === currentTrackId && isPlaying) {
        audio.pause();
        setIsPlaying(false);
        return;
      }

      if (audio.src !== src) {
        audio.src = src;
      }

      audio
        .play()
        .then(() => {
          setCurrentTrackId(trackId);
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Error playing audio:", err);
        });
    },
    [currentTrackId, isPlaying]
  );

  const pause = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTrackId(null);
    };

    const handlePause = () => {
      if (!audio.ended) {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      pause();
      setCurrentTrackId(null);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrackId,
        isPlaying,
        playTrack,
        pause,
      }}
    >
      <audio ref={audioRef} preload="auto" />
      {children}
    </AudioPlayerContext.Provider>
  );
};
