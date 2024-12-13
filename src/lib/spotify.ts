import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
  "user-top-read",
  "user-library-read",
  "user-read-currently-playing",
  "user-read-recently-played",
].join(",");

const params = {
  client_id: process.env.SPOTIFY_CLIENT_ID!,
  response_type: "code",
  redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/spotify`,
  scope: scopes,
  show_dialog: "true",
};

const queryParamString = new URLSearchParams(params).toString();
const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/spotify`,
});

export async function getAccessToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    return data.body.access_token;
  } catch (error) {
    console.error("Error retrieving Spotify access token", error);
  }
}

export default spotifyApi;

export { LOGIN_URL };
