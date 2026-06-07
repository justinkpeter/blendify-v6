import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const INTRO_SEEN_KEY = "blendify_intro_seen";

export function useLoadingScreen() {
  const { status } = useSession();
  const [showLoader, setShowLoader] = useState(false);
  const [dataPromise, setDataPromise] = useState<Promise<unknown> | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (sessionStorage.getItem(INTRO_SEEN_KEY)) return;
    const promise = new Promise((resolve) => setTimeout(resolve, 200));
    setDataPromise(promise);
    setShowLoader(true);
  }, [status]);

  const handleIntroComplete = () => {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    setShowLoader(false);
  };

  return { showLoader, dataPromise, handleIntroComplete, status };
}
