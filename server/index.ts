import { Hono } from "hono";
import auth from "./routes/auth";
import spotify from "./routes/spotify";
import playlist from "./routes/playlist";
import "dotenv/config";

const app = new Hono();

app.use("*", async (c, next) => {
  const origin = c.req.header("Origin");
  const allowedOrigins = [
    "http://localhost:5173",
    "https://soundmood-fullstack.vercel.app",
  ];

  if (origin && allowedOrigins.includes(origin)) {
    c.header("Access-Control-Allow-Origin", origin);
  }

  c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type");
  c.header("Access-Control-Allow-Credentials", "true");

  if (c.req.method === "OPTIONS") return c.body(null, 204);
  await next();
});

app.get("/", (c) => c.text("🎵 API SoundMood en ligne"));
app.get("/healthz", (c) => c.text("OK")); 
app.route("/api", auth);
app.route("/api/spotify", spotify);
app.route("/api/playlist", playlist);

export default {
  port: Number(process.env.PORT) || 3001,
  fetch: app.fetch,
};