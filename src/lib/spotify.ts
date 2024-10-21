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

export { LOGIN_URL };
