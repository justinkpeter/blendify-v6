import SpotifyWebApi from "spotify-web-api-node";

const LOGIN_URL = "https://accounts.spotify.com/authorize";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/spotify`,
});

export default spotifyApi;

export { LOGIN_URL };
