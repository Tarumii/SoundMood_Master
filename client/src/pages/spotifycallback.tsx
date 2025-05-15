import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) return;

      const res = await fetch(`http://localhost:3001/api/spotify/callback?code=${code}`);
      const data = await res.json();

      if (data.access_token) {
        localStorage.setItem("spotify_token", data.access_token);
        navigate("/playlist");
      }
    };

    fetchToken();
  }, [navigate]);

  return <p>Connexion à Spotify en cours...</p>;
}

export default SpotifyCallback;