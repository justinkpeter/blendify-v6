import { useEffect, useState } from "react";
import spotifyApi from "@/lib/spotify";
import { getSession } from "next-auth/react";

// export function useRecommendations(seed: string | null) {
// const [recommendations, setRecommendations] = useState<
//   SpotifyApi.RecommendationTrackObject[] | null
// >(null);
//   const [loading, setLoading] = useState<boolean>(false);

// useEffect(() => {
//   const fetchRecommendations = async () => {
//     if (!seed) return;

//     setLoading(true);
//     try {
//       const session = await getSession();
//       if (!session || !session.accessToken) {
//         setLoading(false);
//         return;
//       }

//       spotifyApi.setAccessToken(session.accessToken as string);
//       spotifyApi.setRefreshToken(session.refreshToken as string);

//       const response = await spotifyApi.getRecommendations({
//         seed_tracks: [seed],
//         limit: 3,
//       });

//       // If the seed changed before the response came back, ignore the response
//       if (seed !== response.body.tracks[0]?.id) return;

//       setRecommendations(response.body.tracks);
//     } catch (err) {
//       console.error("Error fetching recommendations:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchRecommendations();
// }, [seed]);

//   return { recommendations, loading };
// }

export function useRecommendations(seed: string | null) {
  const [recommendations, setRecommendations] = useState<
    SpotifyApi.RecommendationTrackObject[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!seed) return;
    const fetchRecommendations = async () => {
      if (!seed) return;

      setLoading(true);
      try {
        const session = await getSession();
        if (!session || !session.accessToken) {
          setLoading(false);
          return;
        }

        spotifyApi.setAccessToken(session.accessToken as string);
        spotifyApi.setRefreshToken(session.refreshToken as string);

        const response = await spotifyApi.getRecommendations({
          seed_tracks: [seed],
          limit: 3,
        });

        // If the seed changed before the response came back, ignore the response
        if (seed !== response.body.tracks[0]?.id) return;

        setRecommendations(response.body.tracks);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [seed]);

  return {
    recommendations,
    loading,
  };
}
