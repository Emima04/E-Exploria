import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute, { PublicRoute } from "./routes/ProtectedRoute";

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
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        {/* Authentication */}
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* Game Pages */}
        <Route path="/cyber-room" element={<ProtectedRoute><CyberRoom /></ProtectedRoute>} />
        <Route path="/detective-room" element={<ProtectedRoute><DetectiveRoom /></ProtectedRoute>} />
        <Route path="/space-room" element={<ProtectedRoute><SpaceRoom /></ProtectedRoute>} />
        <Route path="/temple-room" element={<ProtectedRoute><TempleRoom /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;