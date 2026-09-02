import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Brain,
  LayoutGrid,
  Sparkles,
  Shield,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const quests = [
  {
    title: "DSA Cyber Core",
    description: "Master fundamental data structures: Stacks, Queues, Hashing, Recursion, and Binary Search algorithms inside the Cyber Room.",
    domain: "DSA",
    progress: 85,
    difficulty: "Beginner",
    completed: 2,
    unlocked: true,
    icon: Code2,
    accent: "from-cyan-400 via-teal-500 to-blue-600",
  },
  {
    title: "HTML Dungeon",
    description: "Fortify the web foundation and restore broken markup rituals.",
    domain: "HTML5",
    progress: 0,
    difficulty: "Beginner",
    completed: 0,
    unlocked: false,
    icon: LayoutGrid,
    accent: "from-violet-500 via-fuchsia-500 to-pink-500",
  },
  {
    title: "CSS Castle",
    description: "Secure the style wards and tame the cascading visual magic.",
    domain: "CSS3",
    progress: 0,
    difficulty: "Beginner",
    completed: 0,
    unlocked: false,
    icon: Sparkles,
    accent: "from-fuchsia-500 via-pink-500 to-rose-500",
  },
  {
    title: "JavaScript Forest",
    description: "Crack the logic code and outsmart the wild script spirits.",
    domain: "JS",
    progress: 0,
    difficulty: "Medium",
    completed: 0,
    unlocked: false,
    icon: Code2,
    accent: "from-amber-400 via-orange-400 to-rose-500",
  },
  {
    title: "DBMS Laboratory",
    description: "Recover corrupted data constructs and protect the archive core.",
    domain: "DBMS",
    progress: 0,
    difficulty: "Medium",
    completed: 0,
    unlocked: false,
    icon: Database,
    accent: "from-sky-400 via-cyan-400 to-blue-500",
  },
  {
    title: "AI Research Center",
    description: "Probe the neural core and unlock hidden intelligence patterns.",
    domain: "AI",
    progress: 0,
    difficulty: "Hard",
    completed: 0,
    unlocked: false,
    icon: Brain,
    accent: "from-emerald-400 via-teal-400 to-cyan-400",
  },
];

export default function Quests() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.16),_transparent_25%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617]/95" />

      <div className="relative z-10 px-6 py-8 lg:px-12 lg:py-10">
        <Navbar />

        <div className="mx-auto max-w-7xl space-y-10">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(168,85,247,0.14)]">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.45em] text-violet-300/80">Quests Hub</p>
                <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Your mission hub for Exploria.
                </h1>
                <p className="mt-4 text-lg leading-8 text-slate-300">
                  Choose a subject card to continue your next adventure with glowing glassmorphism visuals, neon purple lighting, and a cinematic cyberpunk flow.
                </p>
              </div>
              <div className="rounded-[2rem] border border-violet-500/20 bg-[#110a1f]/80 px-6 py-5 shadow-[0_0_40px_rgba(168,85,247,0.18)]">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Current Objective</p>
                <p className="mt-3 text-2xl font-black text-white">Select your next subject</p>
                <p className="mt-2 text-sm text-slate-400">Each card contains progress, difficulty, and mission status to guide you toward the right node.</p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            {quests.map((quest) => {
              const Icon = quest.icon;
              return (
                <motion.div
                  key={quest.title}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.25 }}
                  className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl transition duration-300 ${quest.unlocked ? "hover:border-pink-400/30 hover:bg-white/10" : "opacity-80"}`}
                >
                  <div className="absolute -left-10 top-10 h-44 w-44 rounded-full bg-pink-500/10 blur-3xl" />
                  <div className="absolute -right-10 bottom-10 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />

                  <div className="relative z-10 flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{quest.difficulty}</p>
                      <h2 className="mt-4 text-3xl font-black text-white">{quest.title}</h2>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">{quest.description}</p>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-white shadow-[0_0_30px_rgba(236,72,153,0.18)]">
                      <Icon size={28} />
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                      <span>Progress</span>
                      <span>{quest.progress}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-900/70">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" style={{ width: `${quest.progress}%` }} />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Missions Completed</p>
                      <p className="mt-3 text-2xl font-black text-white">{quest.completed}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">State</p>
                      <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white ${quest.unlocked ? "bg-cyan-500/10 text-cyan-200" : "bg-slate-800 text-slate-400"}`}>
                        {quest.unlocked ? <Shield size={12} /> : <Lock size={12} />}
                        {quest.unlocked ? "Unlocked" : "Locked"}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (quest.unlocked) {
                        navigate("/mission-path", { state: { selectedDomain: quest.domain } });
                      }
                    }}
                    disabled={!quest.unlocked}
                    className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold uppercase tracking-[0.35em] transition ${quest.unlocked ? "bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:brightness-110" : "cursor-not-allowed bg-white/5 text-slate-500"}`}
                  >
                    Continue
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
