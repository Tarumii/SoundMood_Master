import "../styles/splash.css";

export default function SplashScreen() {
  return (
    <div className="splash">
      <div className="splash-content">
        <div className="splash-emojis">
          <span>🌞</span>
          <span>☁️</span>
          <span>🌧️</span>
        </div>
        <h1 className="splash-title">SoundMood</h1>
        <p className="splash-subtitle">Votre créateur de playlist selon votre mood</p>
      </div>
    </div>
  );
}