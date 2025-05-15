import { Hono } from "hono";
import auth from "./routes/auth";
import spotify from "./routes/spotify";
import "dotenv/config";
import playlist from "./routes/playlist";

const app = new Hono();

app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "http://localhost:5173");
  c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type");
  c.header("Access-Control-Allow-Credentials", "true");

  if (c.req.method === "OPTIONS") return c.body(null, 204);
  await next();
});

app.get("/", (c) => c.text("🎵 API SoundMood en ligne"));
app.route("/api", auth);

app.route("/api/spotify", spotify);

app.route("/api/playlist", playlist);

app.get('/healthz', (c) => c.text("OK"));

export default {
  port: 3001,
  fetch: app.fetch,
};