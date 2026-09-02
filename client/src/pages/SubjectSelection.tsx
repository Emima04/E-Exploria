import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Brain,
  LayoutGrid,
  Shield,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const subjects = [
  {
    title: "DSA Cyber Core",
    description: "Master Stacks, Queues, Hashing, Recursion, and Searching algorithms in interactive cyber escape rooms.",
    domain: "DSA",
    progress: 85,
    difficulty: "Beginner",
    status: "unlocked",
    icon: Code2,
    accent: "from-cyan-500 via-teal-500 to-blue-600",
  },
  {
    title: "HTML Dungeon",
    description: "Fortify the web foundation with structural markup challenges.",
    domain: "HTML5",
    progress: 0,
    difficulty: "Beginner",
    status: "locked",
    icon: LayoutGrid,
    accent: "from-cyan-500 via-violet-500 to-purple-500",
  },
  {
    title: "CSS Castle",
    description: "Master glowing layouts, glass effects, and cinematic styling.",
    domain: "CSS3",
    progress: 0,
    difficulty: "Beginner",
    status: "locked",
    icon: Sparkles,
    accent: "from-purple-500 via-fuchsia-500 to-pink-500",
  },
  {
    title: "JavaScript Forest",
    description: "Navigate logic, triggers, and interactive runtime mysteries.",
    domain: "JS",
    progress: 0,
    difficulty: "Medium",
    status: "locked",
    icon: Code2,
    accent: "from-amber-400 via-rose-500 to-fuchsia-500",
  },
  {
    title: "DBMS Laboratory",
    description: "Recover data shards and secure the archive nodes.",
    domain: "DBMS",
    progress: 0,
    difficulty: "Medium",
    status: "locked",
    icon: Database,
    accent: "from-sky-400 via-cyan-500 to-blue-600",
  },
  {
    title: "AI Research Center",
    description: "Unlock the neural core and decipher emergent intelligence.",
    domain: "AI",
    progress: 0,
    difficulty: "Hard",
    status: "locked",
    icon: Brain,
    accent: "from-emerald-400 via-teal-400 to-cyan-400",
  },
];

export default function SubjectSelection() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030510] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_25%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617]/90" />
      <div className="relative z-10 px-6 py-8 lg:px-12 lg:py-10">
        <Navbar />

        <div className="mx-auto max-w-7xl space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-[0_0_120px_rgba(168,85,247,0.15)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.45em] text-violet-300/80">Subject Selection</p>
                <h1 className="max-w-3xl text-5xl font-black tracking-tight text-white sm:text-6xl">
                  Choose your next learning adventure in Exploria.
                </h1>
                <p className="max-w-2xl text-lg text-slate-300 sm:text-xl">
                  Explore futuristic subjects as interactive mission cards, each with a cinematic glow, completion pulse, and progress indicator to guide your next step.
                </p>
              </div>

              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-6 py-3 text-sm font-semibold text-violet-100 transition hover:border-violet-400 hover:bg-violet-500/20"
              >
                <ArrowRight size={18} className="rotate-180" />
                Back to Dashboard
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {subjects.map((subject) => {
              const SubjectIcon = subject.icon;
              const isLocked = subject.status === "locked";

              return (
                <motion.div
                  key={subject.title}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl transition duration-300 ${subject.accent} backdrop-blur-xl`}
                >
                  <div className="absolute -left-10 top-6 h-44 w-44 rounded-full bg-purple-500/10 blur-3xl" />
                  <div className="absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />

                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.45em] text-slate-400">{subject.difficulty}</p>
                      <h2 className="mt-4 text-3xl font-black text-white">{subject.title}</h2>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-cyan-200 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
                      <SubjectIcon size={28} />
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-7 text-slate-300">{subject.description}</p>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-500">
                      <span>Completion</span>
                      <span>{subject.progress}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-900/70">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 transition-all" style={{ width: `${subject.progress}%` }} />
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-4">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.35em] ${isLocked ? "bg-slate-900/80 text-slate-400" : "bg-cyan-500/10 text-cyan-200"}`}>
                      {isLocked ? <Lock size={12} /> : <Shield size={12} />}
                      {isLocked ? "Locked" : "Unlocked"}
                    </span>
                    <button
                      onClick={() => {
                        if (!isLocked) {
                          navigate("/mission-path", { state: { selectedDomain: subject.domain } });
                        }
                      }}
                      disabled={isLocked}
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${isLocked ? "cursor-not-allowed bg-white/5 text-slate-500" : "bg-white/10 text-white hover:bg-white/15"}`}
                    >
                      {isLocked ? "Unlock Soon" : "Enter"}
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-90" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
