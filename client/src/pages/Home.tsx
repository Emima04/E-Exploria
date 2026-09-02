import { useState, useEffect } from "react"; // Added useState hook
import { motion } from "framer-motion";
import {
  Bell,
  Settings,
  Volume2,
  Star,
  Gem,
  Flame,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MissionCard from "../components/MissionCard";
import ActiveCases from "../components/ActiveCases";
import AICompanion from "../components/AICompanion";
import Leaderboard from "../components/Leaderboard";
import DailyReward from "../components/DailyReward";
import RecentAchievements from "../components/RecentAchievements";

// Import your interactive domain decryption system
import AccessTerminalModal from "./AccessTerminalModal";

import heroBackground from "../assets/bg-spaceship.jpg";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const roleSubtitle = user?.role === "faculty" ? "Mentor & Guide" : "Level 7 Adventurer";

  // ==========================================
  // ADDED INTERACTIVE QUIZ CONFIGURATION REGISTERS
  // ==========================================
  const xp = user?.xp ?? 0;
  const level = user?.level ?? 1;
  const streak = user?.streak ?? 0;
  const gems = user?.gems ?? 0;

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("DSA");
  const [currentMissionDomain, setCurrentMissionDomain] = useState("DSA");

  useEffect(() => {
    const saved = localStorage.getItem("currentMissionDomain");
    if (saved) {
      setCurrentMissionDomain(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentMissionDomain", currentMissionDomain);
  }, [currentMissionDomain]);

  useEffect(() => {
    if (!location.state?.focusAiCompanion) return;

    document.getElementById("ai-companion")?.scrollIntoView({ behavior: "smooth", block: "start" });
    navigate("/", { replace: true, state: null });
  }, [location.state, navigate]);

  const handleLaunchQuiz = (domainKey: string) => {
    setSelectedDomain(domainKey);
    setCurrentMissionDomain(domainKey);
    setIsTerminalOpen(true);
  };

  const handleCurrentMissionUpdate = (domainKey: string) => {
    setCurrentMissionDomain(domainKey);
  };

  // const handleMissionComplete = (gain: number) => {
  //   setXp((prev) => prev + gain);
  //   setLevel((prev) => {
  //     const newXp = xp + gain;
  //     const nextThreshold = 1000 + prev * 100;
  //     if (newXp >= nextThreshold) {
  //       return prev + 1;
  //     }
  //     return prev;
  //   });
  // };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen overflow-y-auto pb-10 text-white">

      {/* Background */}

      <img
        src={heroBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center brightness-110 contrast-110 saturate-125 scale-105"
      />

      <div className="absolute inset-0 bg-[#020617]/15" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#38bdf855,transparent_70%)]" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#02061766]" />

      <div className="relative z-10">

        <Navbar />

        {/* ===================== */}
        {/* TOP STATS */}
        {/* ===================== */}

        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-6 flex w-[94%] items-center justify-between"
        >

          {/* LEFT CARD */}

          <div className="flex items-center gap-12 rounded-3xl border border-cyan-500/20 bg-[#061221cc] px-8 py-4 backdrop-blur-xl shadow-xl shadow-cyan-500/10">

            <div className="flex items-center gap-3">

              <Star
                size={25}
                className="text-yellow-400"
              />

              <div>

                <p className="text-xs uppercase tracking-widest text-gray-400">

                  XP

                </p>

                <h2 className="text-2xl font-bold">

                  {xp}

                </h2>

              </div>

            </div>

            <div className="h-10 w-px bg-cyan-500/20" />

            <div className="flex items-center gap-3">

              <Star
                size={25}
                className="text-cyan-400"
              />

              <div>

                <p className="text-xs uppercase tracking-widest text-gray-400">

                  Level

                </p>

                <h2 className="text-2xl font-bold">

                  {level}

                </h2>

              </div>

            </div>

            <div className="h-10 w-px bg-cyan-500/20" />

            <div className="flex items-center gap-3">

              <Flame
                size={25}
                className="text-orange-400"
              />

              <div>

                <p className="text-xs uppercase tracking-widest text-gray-400">

                  Streak

                </p>

                <h2 className="text-2xl font-bold">

                  {streak} Days

                </h2>

              </div>

            </div>

            <div className="h-10 w-px bg-cyan-500/20" />

            <div className="flex items-center gap-3">

              <Gem
                size={25}
                className="text-pink-400"
              />

              <div>

                <p className="text-xs uppercase tracking-widest text-gray-400">

                  Gems

                </p>

                <h2 className="text-2xl font-bold">

                  {gems}

                </h2>

              </div>

            </div>

            {/* QUICK LAUNCH MATRIX CONTROLS FOR TESTING */}
            <div className="h-10 w-px bg-cyan-500/20" />
            <div className="flex items-center gap-1 bg-slate-950/40 rounded-xl p-1 border border-slate-800">
              <button onClick={() => handleLaunchQuiz("DSA")} className="text-[9px] font-mono px-2 py-1 bg-cyan-400 text-black font-bold rounded hover:bg-cyan-300 transition">DSA</button>
              <button onClick={() => handleLaunchQuiz("HTML5")} className="text-[9px] font-mono px-2 py-1 bg-cyan-500/20 rounded hover:bg-cyan-500/40 transition">HTML</button>
              <button onClick={() => handleLaunchQuiz("CSS3")} className="text-[9px] font-mono px-2 py-1 bg-purple-500/20 rounded hover:bg-purple-500/40 transition">CSS</button>
              <button onClick={() => handleLaunchQuiz("JS")} className="text-[9px] font-mono px-2 py-1 bg-amber-500/20 rounded hover:bg-amber-500/40 transition">JS</button>
              <button onClick={() => handleLaunchQuiz("DBMS")} className="text-[9px] font-mono px-2 py-1 bg-rose-500/20 rounded hover:bg-rose-500/40 transition">DBMS</button>
            </div>

          </div>

          {/* RIGHT CARD */}

          <div className="flex items-center gap-3 rounded-3xl border border-cyan-500/20 bg-[#061221cc] px-5 py-4 backdrop-blur-xl shadow-xl shadow-cyan-500/10">

            <button className="rounded-xl border border-cyan-500/20 bg-[#071525] p-3 hover:bg-cyan-500/10">

              <Volume2 size={20} />

            </button>

            <button className="rounded-xl border border-cyan-500/20 bg-[#071525] p-3 hover:bg-cyan-500/10">

              <Bell size={20} />

            </button>

            <button className="rounded-xl border border-cyan-500/20 bg-[#071525] p-3 hover:bg-cyan-500/10">

              <Settings size={20} />

            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-500/20 bg-red-950/10 p-3 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition cursor-pointer flex items-center justify-center"
              title="Logout"
            >
              <LogOut size={20} />
            </button>

            <div className="ml-2 flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-[#071525] px-4 py-2">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400 text-lg font-bold text-black">

                {user?.explorer_name?.charAt(0).toUpperCase() || "E"}

              </div>

              <div>

                <h2 className="text-lg font-bold">

                  {user?.explorer_name || "Explorer"}

                </h2>

                <p className="text-sm text-gray-400">

                  {roleSubtitle}

                </p>

              </div>

            </div>

          </div>

        </motion.div>

        {/* ===================== */}
        {/* MAIN GRID */}
        {/* ===================== */}

        <div className="mx-auto mt-8 grid w-[94%] grid-cols-12 gap-8">

          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="col-span-3"
          >

            <Sidebar />

          </motion.div>

          <div className="col-span-6 space-y-6">
            {/* Current Mission */}

            <MissionCard domainKey={currentMissionDomain} />

            {/* Active Cases */}

            <ActiveCases onSelectMission={handleCurrentMissionUpdate} />

          </div>

          {/* ===================== */}
          {/* RIGHT PANEL */}
          {/* ===================== */}

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            id="ai-companion"
            className="col-span-3 space-y-6"
          >

            {/* AI Companion */}

            <AICompanion />

            {/* Leaderboard */}

            <Leaderboard />

            {/* Daily Reward */}

            <DailyReward />

            {/* System Status moved to Sidebar */}

          </motion.div>

        </div>

        {/* ===================== */}
        {/* RECENT ACHIEVEMENTS */}
        {/* ===================== */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-8 mb-10 w-[94%]"
        >

          <RecentAchievements />

        </motion.div>

      </div>

      {/* ===================== */}
      {/* BACKGROUND GLOW */}
      {/* ===================== */}

      <div className="pointer-events-none absolute left-10 top-44 h-72 w-72 rounded-full bg-cyan-400/10 blur-[130px]" />

      <div className="pointer-events-none absolute right-0 bottom-10 h-96 w-96 rounded-full bg-blue-500/10 blur-[170px]" />

      {/* Floating Particles */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <span className="absolute left-[10%] top-[15%] h-2 w-2 animate-pulse rounded-full bg-cyan-300 opacity-70" />

        <span className="absolute left-[35%] top-[45%] h-3 w-3 animate-pulse rounded-full bg-blue-400 opacity-60" />

        <span className="absolute right-[18%] top-[20%] h-2 w-2 animate-pulse rounded-full bg-cyan-300 opacity-70" />

        <span className="absolute bottom-[20%] left-[40%] h-2 w-2 animate-pulse rounded-full bg-sky-400 opacity-60" />

        <span className="absolute bottom-[30%] right-[28%] h-3 w-3 animate-pulse rounded-full bg-cyan-200 opacity-60" />

        <span className="absolute left-[70%] top-[70%] h-2 w-2 animate-pulse rounded-full bg-cyan-400 opacity-70" />

      </div>

      {/* ==========================================
          SAFE CONTAINER LAYER FOR THE QUIZ WORKSTATION
          ========================================== */}
      {isTerminalOpen && (
        <AccessTerminalModal 
          selectedDomain={selectedDomain} 
          onClose={() => setIsTerminalOpen(false)} 
        />
      )}

    </div>
  );
}