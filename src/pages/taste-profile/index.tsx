import React, { useRef } from "react";
import styles from "@/styles/pages/tasteProfile.module.scss";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import spotifyApi from "@/lib/spotify";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import html2canvas from "html2canvas";
import Barcode from "@/components/Barcode";

export default function TasteProfile({
  topArtists,
  topTracks,
}: {
  topArtists: SpotifyApi.ArtistObjectFull[];
  topTracks: SpotifyApi.TrackObjectFull[];
}) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const downloadReceipt = async () => {
    if (receiptRef.current) {
      // Detect the current theme
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      receiptRef.current.style.backgroundColor = isDarkMode
        ? "#121212"
        : "#ffffff";

      // Hide the download button
      const downloadButton = receiptRef.current.querySelector(
        `.${styles.download}`
      );
      if (downloadButton) {
        (downloadButton as HTMLElement).style.display = "none";
      }

      // Apply the appropriate styles
      if (isDarkMode) {
        console.log("Dark mode");
      } else {
        receiptRef.current.classList.add(styles.lightMode);
      }

      const canvas = await html2canvas(receiptRef.current, {
        scale: 4, // Increase scale to make the image more detailed
        x: 0,
        y: 0,
      });

      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = "taste-profile.png";
      link.click();

      // Revert the styles
      if (isDarkMode) {
        receiptRef.current.classList.remove(styles.darkMode);
      } else {
        receiptRef.current.classList.remove(styles.lightMode);
      }

      receiptRef.current.style.backgroundColor = "";
      // Revert changes
      if (downloadButton) {
        (downloadButton as HTMLElement).style.display = "";
      }
    }
  };

  return (
    <div className={styles.tasteProfile}>
      <div ref={receiptRef} className={styles.receipt}>
        <div className={styles.header}>
          <div className={styles.emoji}>🎧</div>
          <h1>taste profile</h1>
          <h6>[ data powered by spotify ]</h6>
        </div>
        <div className={styles.tracks}>
          <b>Favorite Artists</b>
          <ol>
            {topArtists.map((artist) => (
              <li key={artist.id}>
                <div className={styles.artistNames}>
                  <a href={artist.uri} title={artist.name}>
                    {artist.name}
                  </a>
                  {artist.genres.length > 0 && (
                    <div className={styles.genres}>
                      {artist.genres.slice(0, 1).map((genre, index) => (
                        <>
                          <span key={genre}>{genre}</span>
                          {index < artist.genres.slice(0, 1).length - 1 && ", "}
                        </>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.artists}>
          <b>Songs on repeat</b>
          <ol>
            {topTracks.map((track) => (
              <li key={track.id}>
                <div className={styles.track}>
                  <a href={track.uri} title={track.name}>
                    {track.name}
                  </a>
                  <div className={styles.artistNames}>
                    {track.artists.slice(0, -1).map((artist, index) => (
                      <>
                        <a
                          key={artist.id}
                          href={artist.uri}
                          title={artist.name}
                        >
                          {artist.name}{" "}
                        </a>
                        {index < track.artists.slice(0, -1).length - 1 && ", "}
                      </>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.barcode}>
          <Barcode />
          <span> a true audiophile. </span>
        </div>
        <div className={styles.cta}>
          <Image
            src={"/img/spotify-full-logo-white.png"}
            alt={"Spotify"}
            draggable={false}
            width={87}
            height={24}
          />
          <button onClick={downloadReceipt} className={styles.download}>
            Download <ArrowDownTrayIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  spotifyApi.setAccessToken(session.accessToken as string);
  spotifyApi.setRefreshToken(session.refreshToken as string);

  const topTracks = await spotifyApi
    .getMyTopTracks({ limit: 5, time_range: "medium_term" })
    .then((data) => data.body.items);

  const topArtists = await spotifyApi
    .getMyTopArtists({ limit: 5, time_range: "short_term" })
    .then((data) => data.body.items);

  return { props: { topTracks, topArtists } };
}
