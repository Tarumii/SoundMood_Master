import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import SplashScreen from "../components/splashscreen";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), 3000);
    const audio = new Audio("/sounds/background.mp3");
    audio.volume = 0.1;
    audio.loop = true;
    audio.play().catch(() => {});
    return () => {
      clearTimeout(timeout);
      audio.pause();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        document.cookie = `token=${data.token}; path=/spotifylogin`;
        setTimeout(() => navigate("/spotifylogin"), 500);
      } else {
        alert(data.error || "Erreur de connexion");
        setTimeout(() => setIsSubmitting(false), 500);
      }
    } catch (err) {
      console.error("Erreur serveur :", err);
      alert("Erreur serveur");
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  if (showSplash) return <SplashScreen />;

  return (
    <div className="login-page">
      <span className="emoji emoji-sun">🌞</span>
      <span className="emoji emoji-cloud">☁️</span>
      <span className="emoji emoji-rain">🌧️</span>

      <div className="emoji-grid">
        <span>😢</span>
        <span>😍</span>
        <span>😴</span>
        <span>😎</span>
        <span>😡</span>
      </div>

      <div className="shape shape-purple"></div>
      <div className="shape shape-blue"></div>

      <div className={`login-container ${isSubmitting ? "form-exit" : ""}`}>
        <h2>
          Se connecter à <span className="highlight">SoundMood</span>
        </h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Adresse email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          <div className="password-field">
            <input type={showPassword ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)} title={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" className="login-button">
            Connexion
          </button>
        </form>
        <p>
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;