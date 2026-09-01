import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Volume2, Palette, Check, User } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import heroBackground from "../assets/bg-spaceship.jpg";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { user, login } = useAuth();
  
  // Audio settings
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [volume, setVolume] = useState(80);
  
  // Theme settings
  const [theme, setTheme] = useState("cyan");
  const [hologram, setHologram] = useState(true);
  
  // Profile settings
  const [explorerName, setExplorerName] = useState("");
  const [notifications, setNotifications] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const userEmail = user?.email || "guest";

  // Load existing settings
  useEffect(() => {
    if (user?.explorer_name) {
      setExplorerName(user.explorer_name);
    }
    
    setSfxEnabled(localStorage.getItem(`settings_sfx_${userEmail}`) !== "false");
    setMusicEnabled(localStorage.getItem(`settings_music_${userEmail}`) !== "false");
    setVolume(Number(localStorage.getItem(`settings_volume_${userEmail}`) || "80"));
    setTheme(localStorage.getItem(`settings_theme_${userEmail}`) || "cyan");
    setHologram(localStorage.getItem(`settings_hologram_${userEmail}`) !== "false");
    setNotifications(localStorage.getItem(`settings_notifs_${userEmail}`) !== "false");
  }, [user, userEmail]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save to localStorage
    localStorage.setItem(`settings_sfx_${userEmail}`, String(sfxEnabled));
    localStorage.setItem(`settings_music_${userEmail}`, String(musicEnabled));
    localStorage.setItem(`settings_volume_${userEmail}`, String(volume));
    localStorage.setItem(`settings_theme_${userEmail}`, theme);
    localStorage.setItem(`settings_hologram_${userEmail}`, String(hologram));
    localStorage.setItem(`settings_notifs_${userEmail}`, String(notifications));

    // Update explorer name in AuthContext
    if (user && explorerName.trim()) {
      const updatedUser = { ...user, explorer_name: explorerName.trim() };
      login(updatedUser, localStorage.getItem("token") || undefined);
    }

    setTimeout(() => {
      setLoading(false);
      setMessage("Configuration saved to neural registers!");
      setTimeout(() => setMessage(""), 3000);
    }, 1000);
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

        <div className="mx-auto mt-8 grid w-[94%] grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="col-span-9 space-y-6">
            {/* Header Title Card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-8 backdrop-blur-xl"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
                  <Settings size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-wide text-cyan-300">SYSTEM SETTINGS</h1>
                  <p className="text-sm text-gray-400 mt-1">
                    Manage interface aesthetics, audio signals, and explorer identity credentials.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Settings Form */}
            <form onSubmit={handleSave} className="grid grid-cols-12 gap-6">
              {/* Left Column Settings */}
              <div className="col-span-6 space-y-6">
                {/* Profile Settings */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-6 backdrop-blur-xl space-y-4"
                >
                  <h2 className="text-lg font-bold text-cyan-300 flex items-center gap-2 border-b border-cyan-500/10 pb-3">
                    <User size={18} /> Explorer Identity
                  </h2>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Explorer Code Name</label>
                    <input
                      type="text"
                      value={explorerName}
                      onChange={(e) => setExplorerName(e.target.value)}
                      className="w-full rounded-xl border border-cyan-500/20 bg-slate-950/40 p-3 text-sm focus:border-cyan-400 focus:outline-none transition text-white"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="text-sm font-semibold text-gray-200">Neural Sync Notifications</div>
                      <div className="text-xs text-gray-400">Receive system warnings and quest alerts.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifications(!notifications)}
                      className={`relative h-6 w-11 rounded-full transition-colors duration-200 cursor-pointer ${
                        notifications ? "bg-cyan-400" : "bg-slate-800"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-slate-950 transition-transform duration-200 ${
                          notifications ? "translate-x-5 bg-black" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </motion.div>

                {/* Theme & Visuals */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-6 backdrop-blur-xl space-y-4"
                >
                  <h2 className="text-lg font-bold text-cyan-300 flex items-center gap-2 border-b border-cyan-500/10 pb-3">
                    <Palette size={18} /> Interface Aesthetics
                  </h2>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Neural Color Spectrum</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "cyan", label: "Neon Cyan", color: "bg-cyan-500 border-cyan-400" },
                        { id: "violet", label: "Space Violet", color: "bg-purple-500 border-purple-400" },
                        { id: "crimson", label: "Crimson Cyber", color: "bg-rose-500 border-rose-400" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTheme(t.id)}
                          className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold cursor-pointer transition ${
                            theme === t.id
                              ? "border-cyan-400 bg-cyan-500/10 text-white shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                              : "border-slate-800 bg-slate-950/20 hover:border-slate-700"
                          }`}
                        >
                          <span className={`h-3.5 w-3.5 rounded-full ${t.color}`} />
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2 border-t border-cyan-500/5 pt-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-200">Holographic Grid Overlays</div>
                      <div className="text-xs text-gray-400">Enable scanning scanline overlay on panels.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHologram(!hologram)}
                      className={`relative h-6 w-11 rounded-full transition-colors duration-200 cursor-pointer ${
                        hologram ? "bg-cyan-400" : "bg-slate-800"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-slate-950 transition-transform duration-200 ${
                          hologram ? "translate-x-5 bg-black" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Right Column Settings */}
              <div className="col-span-6 space-y-6">
                {/* Audio Signals */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-6 backdrop-blur-xl space-y-4 h-full flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-cyan-300 flex items-center gap-2 border-b border-cyan-500/10 pb-3">
                      <Volume2 size={18} /> Audio Telemetry
                    </h2>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <div className="text-sm font-semibold text-gray-200">Interface Sound Effects</div>
                        <div className="text-xs text-gray-400">Click notifications and button feedback.</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSfxEnabled(!sfxEnabled)}
                        className={`relative h-6 w-11 rounded-full transition-colors duration-200 cursor-pointer ${
                          sfxEnabled ? "bg-cyan-400" : "bg-slate-800"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-slate-950 transition-transform duration-200 ${
                            sfxEnabled ? "translate-x-5 bg-black" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-cyan-500/5 pt-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-200">Ambient Background Music</div>
                        <div className="text-xs text-gray-400">Subtle space ship dashboard soundtrack.</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMusicEnabled(!musicEnabled)}
                        className={`relative h-6 w-11 rounded-full transition-colors duration-200 cursor-pointer ${
                          musicEnabled ? "bg-cyan-400" : "bg-slate-800"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-slate-950 transition-transform duration-200 ${
                            musicEnabled ? "translate-x-5 bg-black" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="space-y-2 border-t border-cyan-500/5 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-200">Master Volume</span>
                        <span className="font-bold text-cyan-400">{volume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="border-t border-cyan-500/10 pt-6 space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3.5 text-sm font-bold text-black hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>Saving Configuration...</>
                      ) : (
                        <>
                          <Check size={16} /> Save Changes
                        </>
                      )}
                    </button>

                    {message && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2.5 rounded-lg"
                      >
                        {message}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
