import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/create.css";
import spotifyLogo from "../assets/spotifylogo.png";
import soundmoodLogo from "../assets/soundmoodLogo.png";

const moodToGenres: Record<string, string[]> = {
  chill: ["chill", "acoustic", "ambient"],
  énergique: ["edm", "dance", "electro"],
  triste: ["sad", "piano", "acoustic"],
  amoureux: ["romance", "soul", "r-n-b"],
  stressé: ["ambient", "classical", "jazz"],
  enervé: ["metal", "punk", "hardcore"],
};

const moodList = Object.keys(moodToGenres);

export default function Create() {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null); 
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playlists, setPlaylists] = useState<string[]>([]);
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (!token) {
      navigate("/spotify-login");
    } else {
      setSpotifyToken(token);
    }

    const savedPlaylists = JSON.parse(localStorage.getItem("created_playlists") || "[]");
    setPlaylists(savedPlaylists);
  }, [navigate]);

  useEffect(() => {
    if (spotifyToken) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUserProfile(data))
        .catch((err) => console.error(err));
    }
  }, [spotifyToken]);

  const handleGenerate = async () => {
    if (!selectedMood || !selectedGenre || !spotifyToken) return;
    setIsLoading(true);

    const payload = {
      access_token: spotifyToken,
      mood: selectedMood.toLowerCase(),
      genre: selectedGenre.toLowerCase(),
    };

    console.log("➡️ Requête envoyée :", payload);

    try {
      const res = await fetch("http://localhost:3001/api/playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data?.playlist?.external_urls?.spotify) {
        setPlaylistUrl(data.playlist.external_urls.spotify);
        const title = `SoundMood - ${selectedMood}`;
        const updatedPlaylists = [...playlists, title];
        setPlaylists(updatedPlaylists);
        localStorage.setItem("created_playlists", JSON.stringify(updatedPlaylists));
      } else {
        console.error("Erreur Spotify:", data?.error || "Réponse inattendue");
      }
    } catch (err) {
      console.error("Erreur création playlist :", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("spotify_token");
    navigate("/");
  };

  const genreOptions = selectedMood ? moodToGenres[selectedMood.toLowerCase()] : [];

  return (
    <div className="create-page">

      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={spotifyLogo} alt="Spotify Logo" className="spotify-logo" />
          <h1 className="project-title">SoundMood <img src={soundmoodLogo} alt="SoundMood Logo" className="SoundMood-logo"></img></h1>
        </div>
        <div className="playlist-list">
          <h2>🎵 Mes playlists</h2>
          <ul>
            {playlists.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Se déconnecter
        </button>
      </aside>

      <main className="create-content">
        <div className="profile-header">
          {userProfile?.images?.[0]?.url && (
            <img
              src={userProfile.images[0].url}
              alt="Profil Spotify"
              className="profile-img"
              onClick={handleLogout}
            />
          )}
        </div>

        <h2>Crée ta playlist selon ton mood 🎧</h2>

        <div className="mood-section">
          <h3>Choisis ton Mood :</h3>
          <div className="mood-list">
            {moodList.map((mood) => (
              <button
                key={mood}
                className={`mood-btn ${selectedMood === mood ? "selected" : ""}`}
                onClick={() => {
                  setSelectedMood(mood);
                  setSelectedGenre(null);
                }}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {selectedMood && (
          <div className="genre-section">
            <h3>Genres disponibles :</h3>
            <div className="genre-list">
              {genreOptions.map((genre) => (
                <button
                  key={genre}
                  className={`genre-btn ${selectedGenre === genre ? "selected" : ""}`}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          className="generate-playlist-btn"
          onClick={handleGenerate}
          disabled={isLoading || !selectedMood || !selectedGenre}
        >
          {isLoading ? "Création en cours..." : "🎶 Générer la playlist"}
        </button>

        {playlistUrl && (
          <p className="playlist-result">
            🎧 <a href={playlistUrl} target="_blank">Voir ma playlist Spotify</a>
          </p>
        )}
      </main>
    </div>
  );
}