import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AICompanion from "../components/AICompanion";
import heroBackground from "../assets/bg-spaceship.jpg";

export default function AICompanionPage() {
  return (
    <div className="relative min-h-screen overflow-y-auto pb-10 text-white">
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
          <div className="col-span-3">
            <Sidebar />
          </div>

          <main className="col-span-9 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-8 backdrop-blur-xl"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-400">
                  <Bot size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-wide text-cyan-300">ARCHIE AI COMPANION</h1>
                  <p className="mt-1 text-sm text-gray-400">Your learning companion for every mission.</p>
                </div>
              </div>
            </motion.div>

            <AICompanion />
          </main>
        </div>
      </div>
    </div>
  );
}
