import useAuthRedirect from "../hooks/useAuthRedirect";
import { useNavigate } from "react-router-dom";

export default function Home() {
  useAuthRedirect();
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#242424] text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-6">Bienvenue sur SoundMood 🎵</h1>
      <p className="mb-4 text-lg">Connecte-toi à Spotify pour générer ta playlist personnalisée.</p>

      <button onClick={handleLogout} className="mt-4 px-6 py-2 bg-red-600 rounded hover:bg-red-700 transition">
        Se déconnecter
      </button>
    </div>
  );
}