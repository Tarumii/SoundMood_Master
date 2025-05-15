import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SpotifyLogin.css";
import spotifyLogo from "../assets/spotifylogo.png";

const SpotifyLogin = () => {
  const navigate = useNavigate();

  const handleSpotifyLogin = () => {
    window.location.href = "http://localhost:3001/api/spotify/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token) navigate("/playlist");
  }, []);

  const albumCovers = [
    "/albums/album1.jpg",
    "/albums/album2.jpg",
    "/albums/album3.jpg",
    "/albums/album4.jpg",
    "/albums/album5.jpg",
    "/albums/album6.jpg",
    "/albums/album7.jpg",
    "/albums/album8.jpg",
    "/albums/album9.jpg",
    "/albums/album10.jpg",
    "/albums/album11.avif",
    "/albums/album12.jpg",
    "/albums/album13.jpg",
    "/albums/album14.webp",
  ];

  return (
    <div className="spotify-page">
      <div className="album-background">
        {albumCovers.map((src, i) => (
          <img key={i} src={src} alt="album" className="album-image" />
        ))}
      </div>

      <div className="emoji-wrapper">
        <div className="emoji">🎧</div>
        <div className="emoji">☀️</div>
        <div className="emoji">😎</div>
        <div className="emoji">🌧️</div>
        <div className="emoji">🎶</div>
      </div>

      <div className="spotify-container fade-in">
      <img src={spotifyLogo} alt="Spotify Logo" className="spotify-logo" />
        <h1 className="text-3xl font-bold mb-4">
          Connecte ton compte <span>Spotify</span>
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          Pour créer une playlist personnalisée selon ton humeur 🎧
        </p>
        <button
          onClick={handleSpotifyLogin}
          className="spotify-button"
        >
          Se connecter à Spotify
        </button>
      </div>
    </div>
  );
};

export default SpotifyLogin;