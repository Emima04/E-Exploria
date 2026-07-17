import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute, { PublicRoute } from "./routes/ProtectedRoute";

// Mission flow pages
import MissionPath from "./pages/MissionPath";
import MissionIntro from "./pages/MissionIntro";
import Quests from "./pages/Quests";
import SubjectSelection from "./pages/SubjectSelection";

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

        {/* Mission flow pages */}
        <Route path="/mission-path" element={<ProtectedRoute><MissionPath /></ProtectedRoute>} />
        <Route path="/mission-intro" element={<ProtectedRoute><MissionIntro /></ProtectedRoute>} />
        <Route path="/quests" element={<ProtectedRoute><Quests /></ProtectedRoute>} />
        <Route path="/subject-selection" element={<ProtectedRoute><SubjectSelection /></ProtectedRoute>} />

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