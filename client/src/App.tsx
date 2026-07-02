import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Future Pages
import CyberRoom from "./pages/CyberRoom";
import DetectiveRoom from "./pages/DetectiveRoom";
import SpaceRoom from "./pages/SpaceRoom";
import TempleRoom from "./pages/TempleRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Game Pages */}
        <Route path="/cyber-room" element={<CyberRoom />} />
        <Route path="/detective-room" element={<DetectiveRoom />} />
        <Route path="/space-room" element={<SpaceRoom />} />
        <Route path="/temple-room" element={<TempleRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;