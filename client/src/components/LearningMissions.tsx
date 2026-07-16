import {
  Globe,
  Palette,
  Code2,
  Database,
  Brain,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const missions = [
  {
    title: "HTML",
    subtitle: "Web Foundation",
    progress: 80,
    xp: 60,
    color: "cyan",
    icon: Globe,
  },
  {
    title: "CSS",
    subtitle: "Style Lab",
    progress: 40,
    xp: 40,
    color: "purple",
    icon: Palette,
  },
  {
    title: "JavaScript",
    subtitle: "Logic Engine",
    progress: 65,
    xp: 80,
    color: "yellow",
    icon: Code2,
  },
  {
    title: "DBMS",
    subtitle: "Data Vault",
    progress: 55,
    xp: 120,
    color: "red",
    icon: Database,
  },
  {
    title: "AI",
    subtitle: "Neural Nexus",
    progress: 20,
    xp: 150,
    color: "green",
    icon: Brain,
  },
];

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

type MissionState = {
  started: boolean;
  progress: number;
};

export default function LearningMissions() {
  const navigate = useNavigate();
  const [missionState, setMissionState] = useState<Record<string, MissionState>>({});

  const mapToDomain = (title: string) => {
    switch (title) {
      case "HTML":
        return "HTML5";
      case "CSS":
        return "CSS3";
      case "JavaScript":
        return "JS";
      case "DBMS":
        return "DBMS";
      case "AI":
        return "AI";
      default:
        return "HTML5";
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("learningMissionsState");
    if (stored) {
      try {
        setMissionState(JSON.parse(stored));
      } catch {
        setMissionState({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("learningMissionsState", JSON.stringify(missionState));
  }, [missionState]);

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-6 backdrop-blur-xl">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-bold">Learning Missions</h2>

        <button className="text-cyan-400 hover:text-white">View All →</button>

      </div>

      <div className="grid grid-cols-5 gap-5">

        {missions.map((mission) => {
          const Icon = mission.icon;
          const style = colors[mission.color as keyof typeof colors];
          const currentState = missionState[mission.title] || { started: false, progress: 0 };
          const buttonText = currentState.started ? "Continue" : "Start";
          const displayProgress = currentState.started ? currentState.progress : 0;

          return (
            <div
              key={mission.title}
              className={`rounded-2xl border ${style.border} bg-gradient-to-b ${style.bg} p-5 shadow-lg ${style.glow} transition duration-300 hover:-translate-y-2 hover:scale-105`}
            >
              <Icon className={`${style.text} mb-5`} size={34} />

              <p className="text-xs text-gray-400">{mission.title}</p>

              <h3 className="mb-5 text-lg font-bold">{mission.subtitle}</h3>

              <div className="mb-3 flex justify-between text-sm">

                <span>{displayProgress}%</span>

                <span>{mission.xp} XP</span>

              </div>

              <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-700">

                <div className="h-full rounded-full bg-cyan-400" style={{ width: `${displayProgress}%` }} />

              </div>

              <button
                onClick={() => {
                  setMissionState((prev) => {
                    const existing = prev[mission.title] || { started: false, progress: 0 };
                    const step = Math.max(10, Math.round(mission.progress * 0.2));
                    const nextProgress = existing.started
                      ? Math.min(mission.progress, existing.progress + step)
                      : step;

                    return {
                      ...prev,
                      [mission.title]: {
                        started: true,
                        progress: nextProgress,
                      },
                    };
                  });
                  navigate("/cyber-room", { state: { selectedDomain: mapToDomain(mission.title) } });
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-sm transition hover:bg-cyan-500 hover:text-black cursor-pointer"
              >
                {buttonText}
                <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
