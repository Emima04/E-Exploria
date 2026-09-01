import Navbar from "../components/Navbar";
import RecentAchievements from "../components/RecentAchievements";
import { motion } from "framer-motion";
import bgSpaceship from "../assets/bg-spaceship.jpg";

export default function AchievementsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-slate-950">
      <img
        src={bgSpaceship}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.2] pointer-events-none"
      />
      <div className="relative z-10">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RecentAchievements />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
