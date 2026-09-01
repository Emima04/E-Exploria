import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute, { PublicRoute } from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";

// Mission flow pages
import MissionPath from "./pages/MissionPath";
import MissionIntro from "./pages/MissionIntro";
import Quests from "./pages/Quests";
import SubjectSelection from "./pages/SubjectSelection";

// Extra Explorer Pages
import LeaderboardPage from "./pages/LeaderboardPage";
import AchievementsPage from "./pages/AchievementsPage";
import SkillsPage from "./pages/SkillsPage";
import SettingsPage from "./pages/SettingsPage";
import AICompanionPage from "./pages/AICompanionPage";

// New Faculty Page
import Faculty from "./pages/Faculty";

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
        <Route path="/" element={<RoleProtectedRoute allowedRoles={["explorer"]}><Home /></RoleProtectedRoute>} />

        {/* Authentication */}
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* Mission flow pages */}
        <Route path="/mission-path" element={<RoleProtectedRoute allowedRoles={["explorer"]}><MissionPath /></RoleProtectedRoute>} />
        <Route path="/mission-intro" element={<RoleProtectedRoute allowedRoles={["explorer"]}><MissionIntro /></RoleProtectedRoute>} />
        <Route path="/quests" element={<RoleProtectedRoute allowedRoles={["explorer"]}><Quests /></RoleProtectedRoute>} />
        <Route path="/subject-selection" element={<RoleProtectedRoute allowedRoles={["explorer"]}><SubjectSelection /></RoleProtectedRoute>} />

        {/* Game Pages */}
        <Route path="/cyber-room" element={<RoleProtectedRoute allowedRoles={["explorer"]}><CyberRoom /></RoleProtectedRoute>} />
        <Route path="/detective-room" element={<RoleProtectedRoute allowedRoles={["explorer"]}><DetectiveRoom /></RoleProtectedRoute>} />
        <Route path="/space-room" element={<RoleProtectedRoute allowedRoles={["explorer"]}><SpaceRoom /></RoleProtectedRoute>} />
        <Route path="/temple-room" element={<RoleProtectedRoute allowedRoles={["explorer"]}><TempleRoom /></RoleProtectedRoute>} />
        
        {/* Extra Explorer Pages */}
        <Route path="/leaderboard" element={<RoleProtectedRoute allowedRoles={["explorer"]}><LeaderboardPage /></RoleProtectedRoute>} />
        <Route path="/achievements" element={<RoleProtectedRoute allowedRoles={["explorer"]}><AchievementsPage /></RoleProtectedRoute>} />
        <Route path="/skills" element={<RoleProtectedRoute allowedRoles={["explorer"]}><SkillsPage /></RoleProtectedRoute>} />
        <Route path="/settings" element={<RoleProtectedRoute allowedRoles={["explorer"]}><SettingsPage /></RoleProtectedRoute>} />
        <Route path="/ai-companion" element={<RoleProtectedRoute allowedRoles={["explorer"]}><AICompanionPage /></RoleProtectedRoute>} />

        {/* Faculty */}
        <Route path="/faculty" element={<ProtectedRoute><Faculty /></ProtectedRoute>} />
        <Route path="/faculty/:tab" element={<ProtectedRoute><Faculty /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;