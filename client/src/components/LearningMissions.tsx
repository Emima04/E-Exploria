import {
  Code2,
  Globe,
  Palette,
  Database,
  Brain,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";

const colors = {
  cyan: {
    border: "border-cyan-400/40",
    glow: "shadow-cyan-500/20",
    bg: "from-cyan-500/20 to-cyan-500/5",
    text: "text-cyan-300",
  },
  purple: {
    border: "border-purple-400/40",
    glow: "shadow-purple-500/20",
    bg: "from-purple-500/20 to-purple-500/5",
    text: "text-purple-300",
  },
  yellow: {
    border: "border-yellow-400/40",
    glow: "shadow-yellow-500/20",
    bg: "from-yellow-500/20 to-yellow-500/5",
    text: "text-yellow-300",
  },
  red: {
    border: "border-red-400/40",
    glow: "shadow-red-500/20",
    bg: "from-red-500/20 to-red-500/5",
    text: "text-red-300",
  },
  green: {
    border: "border-green-400/40",
    glow: "shadow-green-500/20",
    bg: "from-green-500/20 to-green-500/5",
    text: "text-green-300",
  },
};

const DEFAULT_LEARNING_MISSIONS = [
  {
    id: 1,
    title: "DSA",
    subtitle: "Data Structures & Algorithms - Stacks & Queues",
    xp: 150,
    progress: 40,
    color: "cyan",
  },
  {
    id: 2,
    title: "HTML5",
    subtitle: "Web Matrix Foundations",
    xp: 60,
    progress: 0,
    color: "purple",
  },
  {
    id: 3,
    title: "CSS3",
    subtitle: "Cascading Style Core",
    xp: 80,
    progress: 0,
    color: "yellow",
  },
  {
    id: 4,
    title: "JS",
    subtitle: "Runtime Logic Engines",
    xp: 100,
    progress: 0,
    color: "red",
  },
  {
    id: 5,
    title: "DBMS",
    subtitle: "Relational Query Archive",
    xp: 120,
    progress: 0,
    color: "green",
  },
];

type LearningMissionsProps = {
  onSelectMission?: (domainKey: string) => void;
};

export default function LearningMissions({ onSelectMission }: LearningMissionsProps) {
  const navigate = useNavigate();
  const [missions, setMissions] = useState<any[]>(DEFAULT_LEARNING_MISSIONS);
  const [loading] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get("/missions")
      .then((res) => {
        if (!active) return;
        if (res.data.missions && res.data.missions.length > 0) {
          // Check if DSA is in the list, if not place it first
          const loaded = res.data.missions;
          const hasDSA = loaded.some((m: any) => m.title === "DSA" || m.domain_key === "DSA");
          if (!hasDSA) {
            setMissions([DEFAULT_LEARNING_MISSIONS[0], ...loaded]);
          } else {
            setMissions(loaded);
          }
        }
      })
      .catch((err) => {
        console.error("Error loading learning missions:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  const getIcon = (title: string) => {
    switch (title) {
      case "DSA":
        return Code2;
      case "HTML5":
        return Globe;
      case "CSS3":
        return Palette;
      case "JS":
        return Code2;
      case "DBMS":
        return Database;
      case "AI":
        return Brain;
      default:
        return Code2;
    }
  };

  const getCleanLabel = (title: string) => {
    switch (title) {
      case "DSA":
        return "DSA";
      case "HTML5":
        return "HTML";
      case "CSS3":
        return "CSS";
      case "JS":
        return "JavaScript";
      case "DBMS":
        return "DBMS";
      case "AI":
        return "AI";
      default:
        return title;
    }
  };

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Learning Missions</h2>
        <button onClick={() => navigate("/quests")} className="text-cyan-400 hover:text-white cursor-pointer">View All →</button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 py-6">Connecting to database node...</div>
      ) : missions.length === 0 ? (
        <div className="text-sm text-gray-400 py-6">No learning missions created yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {missions.map((mission) => {
            const Icon = getIcon(mission.title);
            const label = getCleanLabel(mission.title);
            const style = colors[mission.color as keyof typeof colors] || colors.cyan;

            return (
              <div
                key={mission.id}
                className={`rounded-2xl border ${style.border} bg-gradient-to-b ${style.bg} p-5 shadow-lg ${style.glow} transition duration-300 hover:-translate-y-2 hover:scale-105`}
              >
                <Icon className={`${style.text} mb-5`} size={34} />
                <p className="text-xs text-gray-400">{label}</p>
                <h3 className="mb-5 text-sm font-bold h-10 overflow-hidden line-clamp-2">{mission.subtitle}</h3>

                <div className="mb-3 flex justify-between text-xs">
                  <span>{mission.progress}%</span>
                  <span>{mission.xp} XP</span>
                </div>

                <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full rounded-full bg-cyan-400" style={{ width: `${mission.progress}%` }} />
                </div>

                <button
                  onClick={() => {
                    const domainKey = mission.domain_key || mission.title;
                    onSelectMission?.(domainKey);
                    navigate("/cyber-room", { state: { selectedDomain: domainKey } });
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-xs transition hover:bg-cyan-500 hover:text-black cursor-pointer font-bold"
                >
                  {mission.progress > 0 ? "Continue" : "Start"}
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
