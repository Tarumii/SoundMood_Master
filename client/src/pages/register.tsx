import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Erreur lors de l'inscription");
        return;
      }

      setSuccessMessage("Compte créé avec succès ! Redirection...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Erreur serveur :", err);
      setErrorMessage("Erreur de connexion au serveur");
    }
  };

  return (
    <div className="register-page">
        <div className="abstract-shape green-top-left" />
        <div className="abstract-shape green-bottom-right" />
      <div className="emoji-bg">
        <span className="emoji-reg emoji-star">✨</span>
        <span className="emoji-reg emoji-heart">💖</span>
        <span className="emoji-reg emoji-music">🎶</span>
      </div>

      <div className="register-box fade-in">
        <h2>
          Créer un compte <span className="accent">SoundMood</span>
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirmez le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {errorMessage && <p className="error-message">❌ {errorMessage}</p>}
          {successMessage && <p className="success-message">✅ {successMessage}</p>}

          <button type="submit">Inscription</button>
        </form>
        <p className="link">
          Déjà un compte ? <Link to="/login">Connexion</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;