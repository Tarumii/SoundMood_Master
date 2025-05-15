import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Playlist from "./pages/playlist";
import SpotifyLogin from "./pages/spotifylogin";
import SpotifyCallback from "./pages/spotifycallback";
import CreatePlaylist from "./pages/create";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/spotifylogin" element={<SpotifyLogin />} />
        <Route path="/spotify/callback" element={<SpotifyCallback />} />
        <Route path="/create" element={<CreatePlaylist />} />
      </Routes>
    </BrowserRouter>
  );
}