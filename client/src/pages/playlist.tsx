import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Playlist.css";

export default function Playlist() {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("spotify_token", tokenFromUrl);
      setSpotifyToken(tokenFromUrl);
    } else {
      const stored = localStorage.getItem("spotify_token");
      if (stored) {
        setSpotifyToken(stored);
      } else {
        navigate("/");
      }
    }
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

  const handleLogout = () => {
    localStorage.removeItem("spotify_token");
    setSpotifyToken(null);
    navigate("/");
  };

  return (
    <div className="playlist-wrapper">
      <div className="nebula-background">
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      <div className="profile-header">
        {userProfile?.images?.[0]?.url && (
          <img src={userProfile.images[0].url} alt="Profil Spotify" className="profile-img" onClick={handleLogout}/>
        )}
      </div>

      <h1 className="playlist-title">
        Bienvenue sur <span>SoundMood</span> <span>🎵</span>
      </h1>

      {spotifyToken ? (
        <>
          <p className="playlist-subtitle">
            Tu es connecté à Spotify. Tu peux maintenant générer ta playlist selon ton humeur.
          </p>
          <button className="playlist-button" onClick={() => navigate("/create")}>
            <span>🎧</span> Créer une playlist
          </button>
        </>
      ) : (
        <p className="playlist-subtitle">Connexion en cours...</p>
      )}

      <div className="emoji emoji-top-left">☀️</div>
      <div className="emoji emoji-top-right">☔️</div>
      <div className="emoji emoji-center-left">🎵</div>
      <div className="emoji emoji-bottom-right">🧘</div>
      <div className="emoji emoji-bottom-left">🔥</div>

      <div className="waveform-container">
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="waveform-svg"
        >
          <path
            d="M0,160L48,176C96,192,192,224,288,234.7C384,245,480,235,576,213.3C672,192,768,160,864,160C960,160,1056,192,1152,202.7C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="url(#waveGradient)"
            filter="url(#blurEffect)"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
            </linearGradient>
            <filter id="blurEffect">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}