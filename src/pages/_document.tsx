import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Your Spotify listening habits, visualized."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Blendify" />
        <meta property="og:title" content="Blendify — Your Music, Visualized" />
        <meta
          property="og:description"
          content="Your Spotify listening habits, visualized."
        />
        <meta property="og:image" content="https://blendify.app/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Blendify — Your Music, Visualized"
        />
        <meta
          name="twitter:description"
          content="Your Spotify listening habits, visualized."
        />
        <meta
          name="twitter:image"
          content="https://blendify.app/og-image.jpg"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
