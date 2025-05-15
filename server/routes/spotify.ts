import { Hono } from "hono";
import { setCookie } from "hono/cookie";

const spotify = new Hono();
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

spotify.get("/login", (c) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: "playlist-modify-public user-read-email user-read-private",
    redirect_uri: REDIRECT_URI,
  });
  return c.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

spotify.get("/callback", async (c) => {
  const code = c.req.query("code");
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code!,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await res.json();
  return c.redirect(`http://localhost:5173/playlist?token=${data.access_token}`);
});

spotify.get("/me", async (c) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return c.json({ error: "Token manquant" }, 401);

  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const profile = await res.json();
  return c.json(profile);
});

export default spotify;