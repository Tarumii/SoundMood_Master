import { Hono } from "hono";

const playlist = new Hono();

const validGenres = [ "acoustic", "afrobeat", "alt-rock", "ambient", "black-metal", "blues", "chill", "classical",
  "club", "country", "dance", "deep-house", "disco", "drum-and-bass", "dubstep", "edm", "electro",
  "electronic", "folk", "french", "funk", "grindcore", "grunge", "guitar", "hardcore", "heavy-metal",
  "hip-hop", "house", "indie", "jazz", "k-pop", "latin", "metal", "minimal-techno", "opera", "piano",
  "pop", "punk", "r-n-b", "reggae", "reggaeton", "rock", "romance", "sad", "soul", "soundtracks",
  "synth-pop", "techno", "trance", "trip-hop", "world-music" ];
const moodToGenres: Record<string, string[]> = {
  chill: ["chill", "acoustic", "ambient"],
  énergique: ["edm", "dance", "electro"],
  triste: ["sad", "piano", "acoustic"],
  amoureux: ["romance", "soul", "r-n-b"],
  stressé: ["ambient", "classical", "jazz"],
  enervé: ["metal", "punk", "hardcore"]
};

function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

playlist.post("/", async (c) => {
  try {
    const { access_token, mood, genre } = await c.req.json();

    if (!access_token || !mood || !genre) {
      return c.json({ error: "Champs requis manquants." }, 400);
    }

    const baseGenres = moodToGenres[mood.toLowerCase()] || [];
    const seedGenres = [...new Set([...baseGenres, genre.toLowerCase()])]
      .filter((g) => validGenres.includes(g))
      .slice(0, 5);

    if (!seedGenres.length) {
      return c.json({ error: "Genres invalides ou manquants." }, 400);
    }

    const offset = Math.floor(Math.random() * 100);
    const keywords = ["vibe", "energy", "mood", "atmosphere", "emotion"];
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];

    const query = encodeURIComponent(`${seedGenres.join(" ")} ${keyword}`);
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=50&offset=${offset}`,
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );

    const searchData = await searchRes.json();
    const tracks = shuffleArray(searchData.tracks?.items || []).slice(0, 20);
    const uris = tracks.map((track: any) => track.uri);

    if (!uris.length) {
      return c.json({ error: "Aucune piste trouvée." }, 500);
    }

    const userRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const user = await userRes.json();

    const playlistRes = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: `🎵 SoundMood - ${mood} ${genre}`,
        description: "Playlist générée via SoundMood 🎶",
        public: true
      })
    });

    const playlistData = await playlistRes.json();

    await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ uris })
    });

    return c.json({ playlist: playlistData });
  } catch (err) {
    console.error("💥 Erreur serveur création playlist:", err);
    return c.json({ error: "Erreur lors de la création de la playlist." }, 500);
  }
});

export default playlist;