import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import background from "../../assets/images/home/hero-background.avif";
import Particles from "./Particles";
import { useAuth } from "../../context/AuthContext";

export default function Hero() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleButtonClick = () => {
    if (isAuthenticated) {
      navigate("/cyber-room");
    } else {
      navigate("/register");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative h-screen overflow-hidden"
    >
      {/* Background */}
      <motion.img
        src={background}
        alt="Exploria"
        initial={{ scale: 1 }}
        animate={{ scale: 1.12 }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/70 via-black/20 to-transparent" />

      {/* Floating Particles */}
      <Particles />

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-12 py-6 bg-gradient-to-b from-black/60 to-transparent">
        <div className="text-2xl font-black text-cyan-400 tracking-wider">
          EXPLORIA
        </div>
        <div className="flex gap-6 items-center">
          {isAuthenticated ? (
            <>
              <span className="text-zinc-300 font-medium text-sm md:text-base">
                Explorer: <span className="text-cyan-400">{user?.explorer_name || "Active"}</span>
              </span>
              <span className="text-zinc-300 font-medium text-sm md:text-base">
                Role: <span className="text-cyan-400">{user?.role ? user.role.toUpperCase() : "EXPLORER"}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white transition-all duration-300 text-sm font-semibold cursor-pointer"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-cyan-300 hover:text-cyan-100 transition font-semibold text-sm cursor-pointer"
              >
                LOGIN
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2 rounded-lg border border-cyan-400 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all duration-300 text-sm font-semibold cursor-pointer"
              >
                REGISTER
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="ml-24 max-w-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

            <p className="uppercase tracking-[0.3em] text-green-300 text-sm font-semibold">
              SYSTEM ONLINE
            </p>
          </div>

          <h1 className="text-8xl font-black text-white leading-none tracking-wide">
            EXPLORIA
          </h1>

          <p className="mt-6 text-2xl text-cyan-300 font-medium">
            Escape. Learn. Conquer.
          </p>

          <div className="mt-10 border-l-4 border-cyan-400 pl-6">
            <p className="uppercase tracking-[0.3em] text-cyan-300 text-sm mb-4">
              Mission Brief
            </p>

            <p className="text-zinc-300 leading-8 text-lg">
              Knowledge has been fragmented. Investigate immersive escape
              rooms, recover clues, and master every mission.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleButtonClick}
            className="
              mt-12
              px-10
              py-4
              rounded-xl
              border
              border-cyan-400
              bg-cyan-500/10
              backdrop-blur-md
              text-cyan-200
              font-semibold
              text-lg
              hover:bg-cyan-400
              hover:text-black
              transition-all
              duration-300
              hover:shadow-[0_0_40px_#22d3ee]
              cursor-pointer
            "
          >
            {isAuthenticated ? "▶ ENTER MISSION" : "▶ ENTER EXPLORIA"}
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}